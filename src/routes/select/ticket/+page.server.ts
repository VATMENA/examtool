import type { PageServerLoad, Actions } from './$types';
import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_STUDENT } from '$lib/authShared';
import { db } from '$lib/server/db';
import { and, eq, gt } from 'drizzle-orm';
import { exam, examTicket, user } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_STUDENT, true);

	return {
		user: session.user
	};
};

export const actions: Actions = {
	default: async (event) => {
		const session = await requireRole(requireAuth(event.cookies), ROLE_STUDENT, true);

		const form = await event.request.formData();
		const ticket = form.get('ticket');

		if (!ticket) {
			return null;
		}

		const ticketData = await db.query.examTicket.findFirst({
			where: and(
				eq(examTicket.ticket, ticket.toString()),
				gt(examTicket.validUntil, currentTimestamp()),
				eq(examTicket.valid, true),
				eq(examTicket.studentId, session.user.id)
			)
		});

		if (!ticketData) {
			return null;
		}

		const examData = await db.query.exam.findFirst({
			where: eq(exam.id, ticketData.examId)
		});
		const instructor = await db.query.user.findFirst({
			where: eq(user.id, ticketData.issuerId)
		});

		if (!examData || !instructor) return null;

		return {
			ticketData,
			examData,
			instructorNameFirst: instructor.name_first,
			instructorNameLast: instructor.name_last
		};
	}
};
