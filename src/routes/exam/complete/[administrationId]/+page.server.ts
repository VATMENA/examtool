import type { PageServerLoad } from './$types';
import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_STUDENT } from '$lib/authShared';
import { db } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
import {
	auditLogEntry,
	exam,
	examAdministration,
	examAdministrationAnswer,
	examAvailableQuestion
} from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import type { Question } from '$lib/question';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, true);

	const thisExamAdministration = await db.query.examAdministration.findFirst({
		where: eq(exam.id, Number.parseInt(params.administrationId)),
		with: {
			exam: true
		}
	});
	if (!thisExamAdministration) { console.log("no exam, redirecting"); redirect(301, "/select"); }

	if (thisExamAdministration.userId != session.user.id) {
		redirect(301, "/select");
	}

	if (!thisExamAdministration.isSubmitted) {
		// mark the exam complete
		const data = await db.update(examAdministration)
			.set({
				isSubmitted: true
			})
			.where(eq(examAdministration.id, thisExamAdministration.id))
			.returning();
		await db.insert(auditLogEntry)
			.values({
				timestamp: currentTimestamp(),
				userId: session.user.id,
				action: `Sealed exam ${thisExamAdministration.exam.name} administration ${thisExamAdministration.id}`,
				data,
				facilityId: thisExamAdministration.exam.facilityId
			});

		// can we autograde this exam?
		const examQuestions: typeof examAvailableQuestion.$inferSelect[] = thisExamAdministration.examData as typeof examAvailableQuestion.$inferSelect[];
		let autoGradable = true;
		let totalPointsAvailable = 0;
		let pointsReceived = 0;

		for (let i = 0; i < examQuestions.length; i++) {
			const q = examQuestions[i];
			const questionData: Question = q.questionData as Question;
			if (!questionData.canBeAutomaticallyGraded) {
				autoGradable = false;
				break;
			}

			// find exam answer
			const answer = await db.query.examAdministrationAnswer.findFirst({
				where: and(
					eq(examAdministrationAnswer.examAdministrationId, thisExamAdministration.id),
					eq(examAdministrationAnswer.questionId, i)
				)
			});
			if (!answer) {
				if (questionData.type === "multiple-choice") {
					totalPointsAvailable += 4;
					pointsReceived += 0;
				}
			} else {
				if (!answer.isGraded) {
					autoGradable = false;
					break;
				} else {
					totalPointsAvailable += answer.pointsPossible;
					pointsReceived += answer.pointsGiven;
				}
			}
		}

		if (autoGradable) {
			await db.update(examAdministration)
				.set({
					points: pointsReceived,
					pointsAvailable: totalPointsAvailable,
					hasPendingGrade: false
				})
				.where(eq(
					examAdministration.id, thisExamAdministration.id
				));
		}
	}

	// since we may have just changed a bunch of stuff, retrieve updated info
	const maybeScoredExam = await db.query.examAdministration.findFirst({
		where: eq(examAdministration.id, thisExamAdministration.id)
	})!;

	return {
		administrationId: thisExamAdministration.id,
		exam: thisExamAdministration.exam,
		hasPendingGrade: maybeScoredExam.hasPendingGrade,
		score: maybeScoredExam.points / maybeScoredExam.pointsAvailable,
		passingScore: 0.8
	}
}