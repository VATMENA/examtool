import type { PageServerLoad } from './$types';
import { requireAuth, requireRole } from '$lib/auth';
import { ROLE_INSTRUCTOR } from '$lib/authShared';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_INSTRUCTOR);

	return {
		user: session.user,
		rolesIn: session.metRoleIn
	};
};
