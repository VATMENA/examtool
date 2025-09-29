import type { PageServerLoad } from './$types';
import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_STUDENT } from '$lib/authShared';
import { db } from '$lib/server/db';
import { exam, examAdministration } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, true);

	// Find all public exams the user has not taken in facilities where the user is a student
	const allExams = await db.select().from(exam).where(eq(exam.isRestricted, false));

	const userAvailableExams = [];
	for (const possibleExam of allExams) {
		if (!session.metRoleIn.includes(possibleExam.facilityId)) continue;

		// If the user has taken this exam before, they will need a ticket to take it again
		const examAttemptsHere = await db
			.select()
			.from(examAdministration)
			.where(
				and(
					eq(examAdministration.userId, session.user.id),
					eq(examAdministration.examId, possibleExam.id)
				)
			);

		let takeAuthorized = true;
		console.log(examAttemptsHere.length);
		if (examAttemptsHere.length > 2) continue; // Only allow up to 3 attempts
		// If the user has passed, do not allow retakes
		for (const attempt of examAttemptsHere) {
			if (attempt.hasPendingGrade) {
				console.log("not authorized: pending grade");
				// They need to wait for their previous score first
				takeAuthorized = false;
				break;
			}
			if (attempt.points / attempt.pointsAvailable >= 0.8) {
				console.log("not authorized: passed already");
				// They've already passed this exam
				takeAuthorized = false;
				break;
			}
			// This was a failed attempt; meter a retake
			// delay 24h after first failure, 72h after second
			const delay = examAttemptsHere.length == 1 ? 86400 : 86400 * 3;
			if (currentTimestamp() - attempt.startedAt < delay) {
				console.log(currentTimestamp(), attempt.startedAt, currentTimestamp() - attempt.startedAt, delay);
				takeAuthorized = false;
				break; // need to wait for delay
			}
		}

		if (takeAuthorized) {
			userAvailableExams.push(possibleExam);
		}
	}

	return {
		user: session.user,
		userAvailableExams
	};
};
