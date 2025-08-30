import type { PageServerLoad, Actions } from './$types';
import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN } from '$lib/authShared';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import { auditLogEntry, exam, examAvailableQuestion } from '$lib/server/db/schema';
import { questionSchema } from '../questionSchema';
import type { MultipleChoiceQuestion, Question } from '$lib/question';
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
		form: await superValidate(zod(questionSchema)),
		thisExam
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(questionSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const session = await requireRole(requireAuth(event.cookies), ROLE_ADMIN);
		if (!session.metRoleIn.includes(event.params.facility)) {
			redirect(301, '/select');
		}

		// Assemble the question
		let question: Question;
		if (form.data.type === 'multiple-choice') {
			const mcq: MultipleChoiceQuestion = {
				type: 'multiple-choice',
				version: 'v1',
				canBeAutomaticallyGraded: true,
				question: form.data.question,
				choices: form.data.choices
			};
			question = mcq as Question;
		} else {
			return fail(400, { form });
		}
		const question_data = JSON.stringify(question);

		const created_question = await db
			.insert(examAvailableQuestion)
			.values({
				examId: Number.parseInt(event.params.examId),
				questionData: question_data
			})
			.returning();

		console.log(created_question);

		await db.insert(auditLogEntry).values({
			timestamp: currentTimestamp(),
			userId: session.user.id,
			action: `Created new exam question #${created_question[0].id}`,
			data: question_data,
			facilityId: event.params.facility
		});

		return { form };
	}
};
