import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN } from '$lib/authShared';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { and, eq, gt } from 'drizzle-orm';
import { auditLogEntry, exam, examTicket } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_ADMIN);
	if (!session.metRoleIn.includes(params.facility)) {
		redirect(301, '/select');
	}

	const thisExam = await db.query.exam.findFirst({
		where: eq(exam.id, Number.parseInt(params.examId)),
	});

	if (!thisExam) {
		redirect(301, `/${params.facility}/exams`);
	}

	const tickets = await db.query.examTicket.findMany({
		where: and(
			eq(examTicket.examId, thisExam.id),
			gt(examTicket.validUntil, currentTimestamp()),
			eq(examTicket.valid, true)
		)
	});

	return {
		thisExam,
		tickets
	};
};
