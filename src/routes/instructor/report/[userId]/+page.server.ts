import type { PageServerLoad } from './$types';
import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN, ROLE_STUDENT, ROLE_INSTRUCTOR } from '$lib/authShared';
import { db } from '$lib/server/db';
import { examAdministration, user } from '$lib/server/db/schema';
import { and, eq, gt, lt, not, or } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_INSTRUCTOR);

	const ufPastExams = await db.query.examAdministration.findMany({
		where: and(eq(examAdministration.userId, Number.parseInt(params.userId))),
		with: {
			exam: true
		}
	});

	const student = await db.query.user.findFirst({
		where: eq(user.id, Number.parseInt(params.userId))
	});

	return {
		user: session.user,
		student,
		pastExams: ufPastExams
			.filter((u) => {
				return session.metRoleIn.includes(u.exam.facilityId);
			})
			.map((u) => {
				return {
					id: u.id,
					ticketId: u.ticketId,
					isSubmitted: u.isSubmitted,
					isPending: u.hasPendingGrade,
					isPassed: u.points / u.pointsAvailable >= 0.8,
					exam: u.exam,
					startTime: u.startedAt
				};
			})
	};
};
