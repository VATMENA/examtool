import type { PageServerLoad } from "./$types";
import { PUBLIC_VATSIM_OAUTH_BASE, PUBLIC_VATSIM_OAUTH_CLIENT_ID, PUBLIC_VATSIM_OAUTH_REDIRECT_URI } from "$env/static/public";
import { VATSIM_OAUTH_CLIENT_SECRET } from "$env/static/private";
import { db } from '$lib/server/db';
import { facilityRole, user } from '$lib/server/db/schema';
import { createSession } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import { facilities } from '$lib/facilities';
import { eq } from 'drizzle-orm';
import { ROLE_STUDENT } from '$lib/authShared';

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
	const code = url.searchParams.get("code");

	if (code === null) {
		return {
			success: false,
			error: "No code returned from VATSIM."
		}
	}

	const request_body = new URLSearchParams();
	request_body.set("grant_type", "authorization_code");
	request_body.set("client_id", PUBLIC_VATSIM_OAUTH_CLIENT_ID);
	request_body.set("client_secret", VATSIM_OAUTH_CLIENT_SECRET);
	request_body.set("redirect_uri", PUBLIC_VATSIM_OAUTH_REDIRECT_URI);
	request_body.set("code", code);
	request_body.set("scope", "full_name vatsim_details");
	const r = await fetch(`${PUBLIC_VATSIM_OAUTH_BASE}/oauth/token`, {
		method: 'POST',
		body: request_body,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});

	if (!r.ok) {
		console.error(`VATSIM auth error: ${await r.text()}`);
		return {
			success: false,
			error: "Access token request failed."
		};
	}

	const data = await r.json();
	const access_token = data.access_token;

	const user_data_r = await fetch(`${PUBLIC_VATSIM_OAUTH_BASE}/api/user`, {
		headers: {
			"Authorization": `Bearer ${access_token}`
		}
	});
	if (!r.ok) {
		console.error(`VATSIM auth error: ${await r.text()}`);
		return {
			success: false,
			error: "User data request failed."
		}
	};

	const user_data = await user_data_r.json();

	await db.insert(user)
		.values({
			id: user_data.data.cid,
			name_first: user_data.data.personal.name_first,
			name_last: user_data.data.personal.name_last,
		})
		.onConflictDoUpdate({
			target: user.id,
			set: {
				name_first: user_data.data.personal.name_first,
				name_last: user_data.data.personal.name_last,
			}
		});

	// update roles
	await db.delete(facilityRole)
		.where(eq(facilityRole.userId, user_data.data.cid));

	if (user_data.data.vatsim && user_data.data.vatsim.division && user_data.data.vatsim.division.id) {
		const division_id = user_data.data.vatsim.division.id;
		if (division_id === 'MENA') {
			// create/update a divisional assignment
			await db.insert(facilityRole)
				.values({
					userId: user_data.data.cid,
					facilityId: 'division',
					role: ROLE_STUDENT
				});
		}

		if (user_data.data.vatsim.subdivision && user_data.data.vatsim.subdivision.id) {
			const subdivision_id = user_data.data.vatsim.subdivision.id;
			// create/update subdivisional assignment
			if (Object.keys(facilities).includes(subdivision_id)) {
				await db.insert(facilityRole)
					.values({
						userId: user_data.data.cid,
						facilityId: subdivision_id,
						role: ROLE_STUDENT
					});
			}
		}
	}

	const session = await createSession(user_data.data.cid);
	cookies.set(
		'examtool-token',
		session.token,
		{
			maxAge: 86400,
			httpOnly: true,
			secure: true,
			path: '/',
			sameSite: 'lax'
		}
	);

	redirect(301, "/select");

	return {
		success: true
	}
}