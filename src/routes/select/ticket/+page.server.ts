import type { PageServerLoad } from './$types';
import { requireAuth, requireRole } from '$lib/auth';
import { ROLE_STUDENT } from '$lib/authShared';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, true);

	return {
		user: session.user
	};
};
