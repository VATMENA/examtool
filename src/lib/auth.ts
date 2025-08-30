import { db } from '$lib/server/db';
import { facilityRole, session as tSession, user as tUser } from '$lib/server/db/schema';
import { base64ToBytes, bytesToBase64 } from '$lib/utils';
import { eq } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const sessionExpiresInSeconds = 60 * 60 * 24;

export function generateSecureRandomString(): string {
	// Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
	const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';

	// Generate 24 bytes = 192 bits of entropy.
	// We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);

	let id = '';
	for (let i = 0; i < bytes.length; i++) {
		// >> 3 "removes" the right-most 3 bits of the byte
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}

export function generateExamTicket(): string {
	const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';

	const bytes = new Uint8Array(6);
	crypto.getRandomValues(bytes);

	let id = '';
	for (let i = 0; i < bytes.length; i++) {
		// >> 3 "removes" the right-most 3 bits of the byte
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}

export async function createSession(userId: number): Promise<SessionWithToken> {
	const now = new Date();

	const id = generateSecureRandomString();
	const secret = generateSecureRandomString();
	const secretHash = await hashSecret(secret);

	const token = id + '.' + secret;

	const session: SessionWithToken = {
		id,
		secretHash,
		createdAt: now,
		token,
		userId
	};

	await db.insert(tSession).values({
		id: session.id,
		secretHash: bytesToBase64(session.secretHash),
		createdAt: Math.floor(session.createdAt.getTime() / 1000),
		userId: session.userId
	});

	return session;
}

async function validateSessionToken(token: string): Promise<Session | null> {
	const tokenParts = token.split('.');
	if (tokenParts.length !== 2) {
		return null;
	}
	const sessionId = tokenParts[0];
	const sessionSecret = tokenParts[1];

	const session = await getSession(sessionId);
	if (!session) {
		return null;
	}

	const tokenSecretHash = await hashSecret(sessionSecret);
	const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
	if (!validSecret) {
		return null;
	}

	return session;
}

async function getSession(sessionId: string): Promise<Session | null> {
	const now = new Date();

	const result = await db.select().from(tSession).where(eq(tSession.id, sessionId));

	if (result.length !== 1) {
		return null;
	}

	const row = result[0];

	const session: Session = {
		id: row.id,
		secretHash: base64ToBytes(row.secretHash),
		createdAt: new Date(row.createdAt * 1000),
		userId: row.userId
	};

	// Check expiration
	if (now.getTime() - session.createdAt.getTime() >= sessionExpiresInSeconds * 1000) {
		await deleteSession(sessionId);
		return null;
	}

	return session;
}

async function deleteSession(sessionId: string): Promise<void> {
	await db.delete(tSession).where(eq(tSession.id, sessionId));
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.byteLength; i++) {
		c |= a[i] ^ b[i];
	}
	return c === 0;
}

export async function hashSecret(secret: string): Promise<Uint8Array> {
	const secretBytes = new TextEncoder().encode(secret);
	const secretHashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
	return new Uint8Array(secretHashBuffer);
}

export interface SessionWithToken extends Session {
	token: string;
}

export interface Session {
	id: string;
	secretHash: Uint8Array; // Uint8Array is a byte array
	createdAt: Date;
	userId: number;
}

export async function checkAuth(
	cookies: Cookies,
	required: boolean = true
): Promise<Session | null> {
	const token = cookies.get('examtool-token');
	if (!token) {
		if (required) {
			redirect(301, '/');
		}
		return null;
	}

	const session = await validateSessionToken(token);
	if (!session) {
		if (required) {
			redirect(301, '/');
		}
	}

	return session;
}
export async function requireAuth(cookies: Cookies): Promise<AuthenticatedSession> {
	const session = await checkAuth(cookies, true);
	if (!session) {
		redirect(301, '/');
	}

	const userAndRoles = await db.query.user.findFirst({
		where: eq(tUser.id, session.userId),
		with: {
			facilityRole: true
		}
	});

	if (!userAndRoles) {
		await deleteSession(session.id);
		redirect(301, '/');
	}

	return {
		user: userAndRoles,
		...session
	};
}
export async function requireRole(
	session: Promise<AuthenticatedSession>,
	requiredRole: number,
	requireAnyRole: boolean = true
): Promise<RoleAuthenticatedSession> {
	const aSession = await session;

	const metRoleIn = [];

	for (const role of aSession.user.facilityRole) {
		if (role.role >= requiredRole) {
			metRoleIn.push(role.facilityId);
		}
	}

	if (metRoleIn.length == 0 && requireAnyRole) {
		redirect(301, '/select');
	}

	return {
		metRoleIn,
		...aSession
	};
}

export interface AuthenticatedSession extends Session {
	user: typeof tUser.$inferSelect & { facilityRole: (typeof facilityRole.$inferSelect)[] };
}
export interface RoleAuthenticatedSession extends AuthenticatedSession {
	metRoleIn: string[];
}

export function currentTimestamp(): number {
	return Math.floor(new Date().getTime() / 1000);
}
