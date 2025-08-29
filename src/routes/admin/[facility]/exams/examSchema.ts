import { z } from "zod";

export const examSchema = z.object({
	name: z.string(),
	description: z.string(),
	isRestricted: z.boolean(),
});

export type ExamSchema = typeof examSchema;