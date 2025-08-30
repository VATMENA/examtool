import type { ColumnDef } from '@tanstack/table-core';
import type { exam } from '$lib/server/db/schema';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableTypeBadge from './data-table-type-badge.svelte';
import DataTableName from './data-table-name.svelte';
import DataTableActions from './data-table-actions.svelte';

export type Exam = typeof exam.$inferSelect;

export const columns: ColumnDef<Exam>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			return renderComponent(DataTableName, { name: row.original.name, id: row.original.id });
		}
	},
	{
		accessorKey: 'description',
		header: 'Description'
	},
	{
		accessorKey: 'isRestricted',
		header: 'Exam type',
		cell: ({ row }) => {
			return renderComponent(DataTableTypeBadge, { isRestricted: row.original.isRestricted });
		}
	},
	{
		header: 'Actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}
];
