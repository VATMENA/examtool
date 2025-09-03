import type { PageServerLoad, Actions } from './$types';
import { currentTimestamp, generateExamTicket, requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN } from '$lib/authShared';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import { auditLogEntry, exam, examTicket } from '$lib/server/db/schema';
import { ticketSchema } from '../ticketSchema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_ADMIN);
	if (!session.metRoleIn.includes(params.facility)) {
		redirect(301, '/select');
	}

	const thisExam = await db.query.exam.findFirst({
		where: eq(exam.id, Number.parseInt(params.examId))
	});

	return {
		form: await superValidate(zod(ticketSchema)),
		thisExam
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(ticketSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const session = await requireRole(requireAuth(event.cookies), ROLE_ADMIN);
		if (!session.metRoleIn.includes(event.params.facility)) {
			redirect(301, '/select');
		}

		if (form.data.userId === session.user.id) {
			setError(form, 'userId', 'You cannot issue yourself a ticket');
			return fail(400, { form });
		}

		const ticket = await db
			.insert(examTicket)
			.values({
				ticket: generateExamTicket(),
				studentId: form.data.userId,
				issuerId: session.user.id,
				validUntil: currentTimestamp() + 86400 * 7,
				timestamp: currentTimestamp(),
				examId: Number.parseInt(event.params.examId),
				valid: true
			})
			.returning();

		await db.insert(auditLogEntry).values({
			timestamp: currentTimestamp(),
			userId: session.user.id,
			action: `Issued ticket ${ticket[0].ticket} for student ${ticket[0].studentId} and exam ${ticket[0].examId}`,
			data: ticket,
			facilityId: event.params.facility
		});

		return { form };
	}
};
