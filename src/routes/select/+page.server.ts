import type { PageServerLoad } from './$types';
import { requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN, ROLE_STUDENT, ROLE_INSTRUCTOR } from '$lib/authShared';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, false);

	const hasInstructorAnywhereRoleset = await requireRole(requireAuth(cookies), ROLE_INSTRUCTOR, false);
	const hasAdminAnywhereRoleset = await requireRole(requireAuth(cookies), ROLE_ADMIN, false);

	console.log('AA', hasAdminAnywhereRoleset);

	return {
		user: session.user,
		instructorIn: hasInstructorAnywhereRoleset.metRoleIn.length !== 0 ? hasAdminAnywhereRoleset.metRoleIn[0] : null,
		adminIn: hasAdminAnywhereRoleset.metRoleIn.length !== 0 ? hasAdminAnywhereRoleset.metRoleIn[0] : null,
	}
}