import type { PageServerLoad } from './$types';
import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN, ROLE_STUDENT, ROLE_INSTRUCTOR } from '$lib/authShared';
import { db } from '$lib/server/db';
import { examAdministration } from '$lib/server/db/schema';
import { and, eq, gt, lt, not } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, false);

	const ufPastExams = await db.query.examAdministration.findMany({
		where: eq(examAdministration.userId, session.user.id),
		with: {
			exam: true
		}
	});

	return {
		user: session.user,
		pastExams: ufPastExams.map((u) => {
			return {
				id: u.id,
				ticketId: u.ticketId,
				isSubmitted: u.isSubmitted,
				isPending: u.hasPendingGrade,
				isPassed: (u.points / u.pointsAvailable) >= 0.8,
				exam: u.exam,
				startTime: u.startedAt
			}
		})
	}
}