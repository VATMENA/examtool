import type { PageServerLoad } from './$types';
import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN, ROLE_STUDENT, ROLE_INSTRUCTOR } from '$lib/authShared';
import { db } from '$lib/server/db';
import { examAdministration } from '$lib/server/db/schema';
import { and, eq, gt, lt, not } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, false);

	const hasInstructorAnywhereRoleset = await requireRole(requireAuth(cookies), ROLE_INSTRUCTOR, false);
	const hasAdminAnywhereRoleset = await requireRole(requireAuth(cookies), ROLE_ADMIN, false);

	// does this user have an active exam administration
	const activeExam = await db.select()
		.from(examAdministration)
		.where(and(
			eq(examAdministration.userId, session.user.id),
			gt(examAdministration.timeExpiresAt, currentTimestamp()),
			not(eq(examAdministration.isSubmitted, true))
		));

	if (activeExam.length !== 0) {
		const aInfo = activeExam[0];
		redirect(301, `/exam/${aInfo.ticketId}/${aInfo.id}/0`);
	}

	return {
		user: session.user,
		instructorIn: hasInstructorAnywhereRoleset.metRoleIn.length !== 0 ? hasAdminAnywhereRoleset.metRoleIn[0] : null,
		adminIn: hasAdminAnywhereRoleset.metRoleIn.length !== 0 ? hasAdminAnywhereRoleset.metRoleIn[0] : null,
	}
}