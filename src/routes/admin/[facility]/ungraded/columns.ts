import type { ColumnDef } from '@tanstack/table-core';
import type { exam, examAdministration } from '$lib/server/db/schema';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableActions from './data-table-actions.svelte';

export type PendingAdministration = typeof examAdministration.$inferSelect & {
	exam: typeof exam.$inferSelect;
};

export const columns: ColumnDef<PendingAdministration>[] = [
	{
		accessorKey: 'exam.name',
		header: 'Exam Name',
	},
	{
		header: 'Actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}
];
