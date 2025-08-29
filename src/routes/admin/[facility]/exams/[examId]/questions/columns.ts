import type { ColumnDef } from "@tanstack/table-core";
import  { type exam, examAvailableQuestion } from '$lib/server/db/schema';
import { renderComponent } from '$lib/components/ui/data-table';

export type Exam = typeof exam.$inferSelect & { questions: typeof examAvailableQuestion.$inferSelect[] };

export const columns: ColumnDef<Exam>[] = [
	{
		header: "Actions",
		cell: ({ row }) => {
		}
	}
]