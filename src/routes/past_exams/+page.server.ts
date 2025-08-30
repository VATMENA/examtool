import type { PageServerLoad } from './$types';
import { requireAuth, requireRole } from '$lib/auth';
import { ROLE_STUDENT } from '$lib/authShared';
import { db } from '$lib/server/db';
import { examAdministration } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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
				isPassed: u.points / u.pointsAvailable >= 0.8,
				exam: u.exam,
				startTime: u.startedAt
			};
		})
	};
};
