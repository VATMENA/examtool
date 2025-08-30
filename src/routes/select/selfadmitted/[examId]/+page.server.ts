import type { PageServerLoad, Actions } from './$types';
import { currentTimestamp, generateExamTicket, requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN, ROLE_STUDENT, ROLE_INSTRUCTOR } from '$lib/authShared';
import { db } from '$lib/server/db';
import {
	auditLogEntry,
	exam,
	examAdministration,
	examAvailableQuestion,
	examTicket
} from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, true);

	const thisExam = await db.query.exam.findFirst({
		where: eq(exam.id, Number.parseInt(params.examId)),
		with: {
			attempts: {
				where: (attempt, { eq }) => eq(attempt.userId, session.user.id)
			}
		}
	});

	if (!thisExam) {
		redirect(301, '/select/selfadmitted');
	}

	const examQuestions = await db.query.examAvailableQuestion.findMany({
		where: eq(examAvailableQuestion.examId, thisExam.id)
	});

	const numberOfQuestions = Math.min(thisExam.examQuestionCount, examQuestions.length);

	return {
		user: session.user,
		thisExam,
		numberOfQuestions
	};
};

export const actions: Actions = {
	default: async ({ cookies, params }) => {
		const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, true);

		const thisExam = await db.query.exam.findFirst({
			where: eq(exam.id, Number.parseInt(params.examId)),
			with: {
				attempts: {
					where: (attempt, { eq }) => eq(attempt.userId, session.user.id)
				}
			}
		});

		if (!thisExam) {
			redirect(301, '/select/selfadmitted');
		}

		const ticketCode = generateExamTicket();

		const data = await db
			.insert(examTicket)
			.values({
				ticket: ticketCode,
				timestamp: Math.floor(new Date().getTime() / 1000),
				validUntil: Math.floor(new Date().getTime() / 1000 + thisExam.examTimeAlotted!),
				examId: thisExam.id,
				studentId: session.user.id,
				issuerId: session.user.id,
				valid: true
			})
			.returning();

		await db.insert(auditLogEntry).values({
			timestamp: currentTimestamp(),
			userId: session.user.id,
			action: `Self-admitted to ${thisExam.name} with ticket ${data[0].ticket}`,
			data,
			facilityId: thisExam.facilityId
		});

		redirect(301, `/select/ticket/start/${ticketCode}`);
	}
};
