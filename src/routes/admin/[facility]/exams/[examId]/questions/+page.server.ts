import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN } from '$lib/authShared';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { auditLogEntry, exam } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_ADMIN);
	if (!session.metRoleIn.includes(params.facility)) {
		redirect(301, '/select');
	}

	const thisExam = await db.query.exam.findFirst({
		where: eq(exam.id, Number.parseInt(params.examId)),
		with: {
			questions: {
				orderBy: (questions, { asc }) => [asc(questions.id)]
			}
		}
	});

	if (!thisExam) {
		redirect(301, `/${params.facility}/exams`);
	}

	await db.insert(auditLogEntry).values({
		timestamp: currentTimestamp(),
		userId: session.user.id,
		action: `Accessed questions of exam ${thisExam.name}`,
		data: {},
		facilityId: params.facility
	});

	console.log(thisExam);

	return {
		thisExam
	};
};
