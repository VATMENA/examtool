import type { PageServerLoad } from './$types';
import { requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN } from '$lib/authShared';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import {
	exam,
	examAdministration,
	examAdministrationAnswer,
	examAvailableQuestion
} from '$lib/server/db/schema';
import type { FreeResponseQuestion, Question } from '$lib/question';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { gradingSchema } from './gradingSchema';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_ADMIN);
	if (!session.metRoleIn.includes(params.facility)) {
		redirect(301, '/select');
	}

	const pendingAdministration = await db.query.examAdministration.findFirst({
		where: and(
			eq(examAdministration.isSubmitted, true),
			eq(examAdministration.hasPendingGrade, true),
			eq(examAdministration.id, Number.parseInt(params.administrationId))
		),
		with: {
			exam: true,
		}
	});
	if (!pendingAdministration) {
		redirect(301, `/admin/${params.facility}/ungraded`);
	}

	const ungradedQuestions = await db.query.examAdministrationAnswer.findMany({
		where: and(
			eq(examAdministrationAnswer.examAdministrationId, Number.parseInt(params.administrationId)),
			eq(examAdministrationAnswer.requiresManualGrading, true),
			eq(examAdministrationAnswer.isGraded, false)
		),
	});

	const examQuestions: (typeof examAvailableQuestion.$inferSelect)[] =
		pendingAdministration.examData as (typeof examAvailableQuestion.$inferSelect)[];


	const gradeMap: Record<string, any> = {};
	for (const ugQ of ungradedQuestions) {
		const currentQuestionId = ugQ.questionId;
		const currentQuestion = examQuestions[currentQuestionId];

		const currentQuestionData: Question = currentQuestion.questionData as Question;

		let q;
		let a;

		if (currentQuestionData.type === "free-response") {
			q = (currentQuestionData as FreeResponseQuestion).question;
			// @ts-expect-error it's fine
			a = ugQ.answer.toString();
		}

		gradeMap[ugQ.id.toString()] = {
			question: q,
			answer: a,
			pointsPossible: ugQ.pointsPossible,
			pointsGiven: ugQ.pointsGiven
		};
	}

	return {
		pendingAdministration,
		form: await superValidate({
			data: gradeMap
		}, zod(gradingSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const session = await requireRole(requireAuth(event.cookies), ROLE_ADMIN);
		if (!session.metRoleIn.includes(event.params.facility)) {
			redirect(301, '/select');
		}

		const form = await superValidate(event, zod(gradingSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// Grade exam
		const pendingAdministration = await db.query.examAdministration.findFirst({
			where: and(
				eq(examAdministration.isSubmitted, true),
				eq(examAdministration.hasPendingGrade, true),
				eq(examAdministration.id, Number.parseInt(event.params.administrationId))
			),
			with: {
				exam: true,
			}
		});
		if (!pendingAdministration) {
			redirect(301, "/select");
		}

		let pointsReceived = 0;
		let totalPointsAvailable = 0;

		const examQuestions: (typeof examAvailableQuestion.$inferSelect)[] =
			pendingAdministration.examData as (typeof examAvailableQuestion.$inferSelect)[];

		let i = 0;

		for (const q of examQuestions) {
			const currentQuestionData: Question = q.questionData as Question;
			if (currentQuestionData.canBeAutomaticallyGraded) {
				// pull the answer, if available
				const answer = await db.query.examAdministrationAnswer.findFirst({
					where: and(
						eq(examAdministrationAnswer.examAdministrationId, pendingAdministration.id),
						eq(examAdministrationAnswer.questionId, i)
					)
				});
				if (!answer) {
					if (currentQuestionData.type === 'multiple-choice') {
						totalPointsAvailable += 4;
						pointsReceived += 0;
					}
				} else {
					totalPointsAvailable += answer.pointsPossible;
					pointsReceived += answer.pointsGiven;
				}
			} else {
				// pull points from the form
				const answer = await db.query.examAdministrationAnswer.findFirst({
					where: and(
						eq(examAdministrationAnswer.examAdministrationId, pendingAdministration.id),
						eq(examAdministrationAnswer.questionId, i)
					)
				});
				if (!answer) {
					if (currentQuestionData.type === "free-response") {
						totalPointsAvailable += 4;
						pointsReceived += 0;
					}
				} else {
					const graded = form.data.data[answer.id.toString()];
					totalPointsAvailable += graded.pointsPossible;
					pointsReceived += graded.pointsGiven;
					await db
						.update(examAdministrationAnswer)
						.set({
							pointsGiven: graded.pointsGiven,
							pointsPossible: graded.pointsPossible,
						})
						.where(eq(examAdministrationAnswer.id, answer.id));
				}

			}
			i += 1;
		}

		await db
			.update(examAdministration)
			.set({
				points: pointsReceived,
				pointsAvailable: totalPointsAvailable,
				hasPendingGrade: false
			})
			.where(eq(examAdministration.id, pendingAdministration.id));

		return { form };
	}
}