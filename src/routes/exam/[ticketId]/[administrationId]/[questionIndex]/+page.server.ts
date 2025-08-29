import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import { ROLE_STUDENT } from '$lib/authShared';
import { eq } from 'drizzle-orm';
import { exam, examAvailableQuestion, examTicket } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import type { MultipleChoiceQuestion, Question } from '$lib/question';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, true);
	// load ticket data

	const thisExamAdministration = await db.query.examAdministration.findFirst({
		where: eq(exam.id, Number.parseInt(params.administrationId)),
		with: {
			exam: true
		}
	});
	if (!thisExamAdministration) { console.log("no exam, redirecting"); redirect(301, "/select"); }

	const thisExamTicket = await db.query.examTicket.findFirst({
		where: eq(examTicket.id, params.ticketId)
	});
	if (!thisExamTicket) { console.log("no exam ticket, redirecting"); redirect(301, "/select"); }

	if (thisExamTicket.valid) {
		console.log("non-redeemed exam ticket");
		redirect(301, "/select");
	}
	if (thisExamTicket.studentId != session.user.id) {
		console.log("student mismatch");
		redirect(301, "/select");
	}
	if (thisExamTicket.validUntil < currentTimestamp()) {
		console.log("ticket expired");
		redirect(301, "/select");
	}

	if (thisExamAdministration.timeExpiresAt < currentTimestamp()) {
		console.log("administration concluded");
		redirect(301, `/exam/completed/${thisExamAdministration.id}`);
	}

	const examQuestions: typeof examAvailableQuestion.$inferSelect[] = thisExamAdministration.examData as typeof examAvailableQuestion.$inferSelect[];
	const currentQuestionId = Number.parseInt(params.questionIndex);
	const currentQuestion = examQuestions[currentQuestionId];

	const currentQuestionData: Question = currentQuestion.questionData as Question;

	let strippedQuestionData;
	if (currentQuestionData.type === "multiple-choice") {
		const q: MultipleChoiceQuestion = currentQuestionData as MultipleChoiceQuestion;
		strippedQuestionData = {
			type: "multiple-choice",
			question: q.question,
			choices: q.choices.map((u) => u.text)
		};
	}

	return {
		strippedQuestionData,
		exam: thisExamAdministration.exam,
		questionNumber: currentQuestionId + 1,
		expiryTime: thisExamAdministration.timeExpiresAt,
		totalQuestions: examQuestions.length,

		ticketId: thisExamTicket.id,
		administrationId: thisExamAdministration.id
	}
}