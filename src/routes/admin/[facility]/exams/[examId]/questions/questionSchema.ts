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
	}),
	z.object({
		type: z.literal('free-response'),
		question: z.string()
	})
]);

export type QuestionSchema = typeof questionSchema;

export const questionTypes = {
	'multiple-choice': 'Multiple Choice',
	'free-response': 'Free Response'
};
