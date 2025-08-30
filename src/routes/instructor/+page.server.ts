import type { PageServerLoad } from './$types';
import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN, ROLE_STUDENT, ROLE_INSTRUCTOR } from '$lib/authShared';
import { db } from '$lib/server/db';
import { examAdministration } from '$lib/server/db/schema';
import { and, eq, gt, lt, not } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_INSTRUCTOR);

	return {
		user: session.user,
		rolesIn: session.metRoleIn
	};
};
