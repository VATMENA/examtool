import { z } from 'zod';

export const ticketSchema = z.object({
	userId: z.coerce.number()
});

export type TicketSchema = typeof ticketSchema;
