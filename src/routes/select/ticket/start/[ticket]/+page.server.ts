import type { PageServerLoad } from './$types';
import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_STUDENT } from '$lib/authShared';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import {
	auditLogEntry,
	exam,
	examAdministration,
	examAvailableQuestion,
	examTicket
} from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, true);

	// Start the exam:
	// - sample exam questions to build exam
	// - create the exam administration
	// - invalidate the ticket
	// - then redirect the user to the exam

	// load ticket data
	const thisExamTicket = await db.query.examTicket.findFirst({
		where: eq(examTicket.ticket, params.ticket)
	});
	if (!thisExamTicket) {
		console.log('no exam ticket, redirecting');
		redirect(301, '/select');
	}

	const thisExam = await db.query.exam.findFirst({
		where: eq(exam.id, thisExamTicket.examId)
	});
	if (!thisExam) {
		console.log('no exam, redirecting');
		redirect(301, '/select');
	}

	if (!thisExamTicket.valid) {
		redirect(301, '/select');
	}
	if (thisExamTicket.studentId != session.user.id) {
		redirect(301, '/select');
	}
	if (thisExamTicket.validUntil < currentTimestamp()) {
		redirect(301, '/select');
	}

	// 1. sample exam questions

	const examQuestions = await db.query.examAvailableQuestion.findMany({
		where: eq(examAvailableQuestion.examId, thisExam.id)
	});

	const numberOfQuestions = Math.min(thisExam.examQuestionCount, examQuestions.length);

	// randomly sample N questions
	function getRandomSubarray<T>(arr: T[], size: number): T[] {
		// eslint-disable-next-line prefer-const
		let shuffled = arr.slice(0),
			i = arr.length,
			temp,
			index;
		while (i--) {
			index = Math.floor((i + 1) * Math.random());
			temp = shuffled[index];
			shuffled[index] = shuffled[i];
			shuffled[i] = temp;
		}
		return shuffled.slice(0, size);
	}
	const questions = getRandomSubarray(examQuestions, numberOfQuestions);

	await db.insert(auditLogEntry).values({
		timestamp: currentTimestamp(),
		userId: session.user.id,
		action: `Generated exam form for exam ${thisExam.name} and ticket ${thisExamTicket.ticket}`,
		data: questions,
		facilityId: thisExam.facilityId
	});

	// 2: create exam administration
	const administration = await db
		.insert(examAdministration)
		.values({
			examId: thisExam.id,
			userId: session.user.id,
			examData: questions,
			startedAt: currentTimestamp(),
			timeExpiresAt: currentTimestamp() + thisExam.examTimeAlotted!,
			isSubmitted: false,
			points: 0,
			pointsAvailable: questions.length,
			ticketId: thisExamTicket.id
		})
		.returning();

	await db.insert(auditLogEntry).values({
		timestamp: currentTimestamp(),
		userId: session.user.id,
		action: `Started exam administration ${administration[0].id}`,
		data: administration,
		facilityId: thisExam.facilityId
	});

	// 3: invalidate the ticket

	const updatedTicket = await db
		.update(examTicket)
		.set({
			valid: false
		})
		.where(eq(examTicket.id, thisExamTicket.id))
		.returning();
	await db.insert(auditLogEntry).values({
		timestamp: currentTimestamp(),
		userId: session.user.id,
		action: `Redeemed exam ticket ${thisExamTicket.ticket}`,
		data: updatedTicket,
		facilityId: thisExam.facilityId
	});

	// 4: redirect the user

	redirect(301, `/exam/${thisExamTicket.id}/${administration[0].id}/0`);
};
