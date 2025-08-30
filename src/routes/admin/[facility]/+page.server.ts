import type { PageServerLoad } from './$types';
import { requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN } from '$lib/authShared';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_ADMIN);

	if (!session.metRoleIn.includes(params.facility)) {
		redirect(301, '/select');
	}

	return {};
};
