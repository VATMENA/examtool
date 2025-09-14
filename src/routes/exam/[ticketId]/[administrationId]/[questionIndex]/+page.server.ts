import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ROLE_INSTRUCTOR, ROLE_STUDENT } from '$lib/authShared';
import { and, eq } from 'drizzle-orm';
import {
	exam,
	examAdministrationAnswer,
	examAvailableQuestion,
	examTicket
} from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import type { FreeResponseQuestion, MultipleChoiceQuestion, Question } from '$lib/question';

export const load: PageServerLoad = async ({ cookies, params, url }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, true);
	// load ticket data

	const maybeInstructor = await requireRole(requireAuth(cookies), ROLE_INSTRUCTOR, false);
	const isReviewMode = url.searchParams.has('review');

	if (isReviewMode && maybeInstructor.metRoleIn.length === 0) {
		redirect(301, '/select');
	}

	if (isReviewMode) {
		console.log('!! REVIEW MODE !!');
	}

	const thisExamAdministration = await db.query.examAdministration.findFirst({
		where: eq(exam.id, Number.parseInt(params.administrationId)),
		with: {
			exam: true
		}
	});
	if (!thisExamAdministration) {
		console.log('no exam, redirecting');
		redirect(301, '/select');
	}

	const thisExamTicket = await db.query.examTicket.findFirst({
		where: eq(examTicket.id, params.ticketId)
	});
	if (!thisExamTicket) {
		console.log('no exam ticket, redirecting');
		redirect(301, '/select');
	}

	if (thisExamTicket.valid) {
		redirect(301, '/select');
	}
	if (thisExamTicket.studentId != session.user.id && !isReviewMode) {
		redirect(301, '/select');
	}

	if (
		(thisExamAdministration.timeExpiresAt < currentTimestamp() ||
			thisExamAdministration.isSubmitted) &&
		!isReviewMode
	) {
		redirect(301, `/exam/complete/${thisExamAdministration.id}`);
	}

	const examQuestions: (typeof examAvailableQuestion.$inferSelect)[] =
		thisExamAdministration.examData as (typeof examAvailableQuestion.$inferSelect)[];
	const currentQuestionId = Number.parseInt(params.questionIndex);
	const currentQuestion = examQuestions[currentQuestionId];

	const currentQuestionData: Question = currentQuestion.questionData as Question;

	let strippedQuestionData;
	if (currentQuestionData.type === 'multiple-choice') {
		const q: MultipleChoiceQuestion = currentQuestionData as MultipleChoiceQuestion;
		if (!isReviewMode) {
			strippedQuestionData = {
				type: 'multiple-choice',
				question: q.question,
				choices: q.choices.map((u) => {
					u.isCorrect = false;
					return u;
				})
			};
		} else {
			strippedQuestionData = q;
		}
	} else if (currentQuestionData.type === 'free-response') {
		const q: FreeResponseQuestion = currentQuestionData as FreeResponseQuestion;
		strippedQuestionData = q;
	}

	// check if there is an answer for this question
	const maybeAnswerObj = await db.query.examAdministrationAnswer.findFirst({
		where: and(
			eq(examAdministrationAnswer.examAdministrationId, thisExamAdministration.id),
			eq(examAdministrationAnswer.questionId, currentQuestionId)
		)
	});

	const maybeAnswer = maybeAnswerObj ? maybeAnswerObj.answer : null;

	return {
		strippedQuestionData,
		exam: thisExamAdministration.exam,
		questionNumber: currentQuestionId + 1,
		expiryTime: thisExamAdministration.timeExpiresAt,
		totalQuestions: examQuestions.length,

		ticketId: thisExamTicket.id,
		administrationId: thisExamAdministration.id,

		maybeAnswer,
		isReviewMode,
		studentId: thisExamAdministration.userId
	};
};
export const actions: Actions = {
	default: async (event) => {
		const session = await requireRole(requireAuth(event.cookies), ROLE_STUDENT, true);
		// load ticket data

		const thisExamAdministration = await db.query.examAdministration.findFirst({
			where: eq(exam.id, Number.parseInt(event.params.administrationId)),
			with: {
				exam: true
			}
		});
		if (!thisExamAdministration) {
			console.log('no exam, redirecting');
			redirect(301, '/select');
		}

		const thisExamTicket = await db.query.examTicket.findFirst({
			where: eq(examTicket.id, event.params.ticketId)
		});
		if (!thisExamTicket) {
			console.log('no exam ticket, redirecting');
			redirect(301, '/select');
		}

		if (thisExamTicket.valid) {
			console.log('non-redeemed exam ticket');
			redirect(301, '/select');
		}
		if (thisExamTicket.studentId != session.user.id) {
			console.log('student mismatch');
			redirect(301, '/select');
		}
		if (thisExamTicket.validUntil < currentTimestamp()) {
			console.log('ticket expired');
			redirect(301, '/select');
		}

		if (thisExamAdministration.timeExpiresAt < currentTimestamp()) {
			console.log('administration concluded');
			redirect(301, `/exam/complete/${thisExamAdministration.id}`);
		}

		const examQuestions: (typeof examAvailableQuestion.$inferSelect)[] =
			thisExamAdministration.examData as (typeof examAvailableQuestion.$inferSelect)[];
		const currentQuestionId = Number.parseInt(event.params.questionIndex);
		const currentQuestion = examQuestions[currentQuestionId];

		const currentQuestionData: Question = currentQuestion.questionData as Question;

		const answerDataForm = await event.request.formData();
		const answerData = await JSON.parse(answerDataForm.get('answerData'));

		// eslint-disable-next-line
		let userQuestionAnswer: any;
		let isGraded = false;
		let requiresManualGrading = true;

		let pointsGiven = 0;
		let pointsPossible = 0;

		if (currentQuestionData.type === 'multiple-choice') {
			const q: MultipleChoiceQuestion = currentQuestionData as MultipleChoiceQuestion;
			userQuestionAnswer = answerData.multipleChoice;

			isGraded = true;
			requiresManualGrading = false;
			if (q.choices[userQuestionAnswer].isCorrect) {
				pointsGiven = 4;
			}
			pointsPossible = 4;
		} else if (currentQuestionData.type === "free-response") {
			console.log(answerData);
			userQuestionAnswer = answerData.freeResponse;

			isGraded = false;
			requiresManualGrading = true;
			pointsGiven = 0;
			pointsPossible = 4;
		}

		await db
			.insert(examAdministrationAnswer)
			.values({
				examAdministrationId: thisExamAdministration.id,
				questionId: currentQuestionId,

				answer: userQuestionAnswer,

				isGraded,
				requiresManualGrading,
				pointsGiven,
				pointsPossible
			})
			.onConflictDoUpdate({
				target: [
					examAdministrationAnswer.questionId,
					examAdministrationAnswer.examAdministrationId
				],
				set: {
					answer: userQuestionAnswer,
					isGraded,
					requiresManualGrading,
					pointsGiven,
					pointsPossible
				}
			});

		return;
	}
};
