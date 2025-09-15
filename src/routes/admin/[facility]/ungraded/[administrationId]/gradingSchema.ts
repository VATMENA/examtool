import { z } from "zod";

export const gradingSchema = z.object({
	data: z.record(
		z.string().readonly(),
		z.object({
			question: z.string().readonly(),
			answer: z.string().readonly(),

			pointsPossible: z.number().readonly(),
			pointsGiven: z.number(),
		})
	)
});
export type GradingSchema = typeof gradingSchema;