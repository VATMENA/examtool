import { z } from 'zod';

export const questionSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('multiple-choice'),
		question: z.string(),
		choices: z.array(
			z.object({
				text: z.string(),
				isCorrect: z.boolean()
			})
		)
	})
]);

export type QuestionSchema = typeof questionSchema;

export const questionTypes = {
	'multiple-choice': 'Multiple Choice'
};
