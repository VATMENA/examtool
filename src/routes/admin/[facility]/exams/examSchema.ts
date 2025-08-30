import { z } from 'zod';

export const examSchema = z.object({
	name: z.string(),
	description: z.string(),
	isRestricted: z.boolean(),
	numberOfQuestions: z.number().min(1),
	timeAlottedHrs: z.number().min(0),
	timeAlottedMins: z.number().min(0).max(59)
});

export type ExamSchema = typeof examSchema;
