import type { ColumnDef } from '@tanstack/table-core';
import type { examTicket } from '$lib/server/db/schema';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableActions from './data-table-actions.svelte';

export type Ticket = typeof examTicket.$inferSelect;

export const columns: ColumnDef<Ticket>[] = [
	{
		header: 'Ticket Number',
		accessorKey: 'ticket'
	},
	{
		header: 'Student',
		accessorKey: 'studentId'
	},
	{
		header: 'Issued By',
		accessorKey: 'issuerId'
	},
	{
		header: 'Valid Until',
		accessorKey: 'validUntil',
		cell: ({ row }) => {
			return new Date(row.original.validUntil * 1000).toLocaleDateString();
		}
	},
	{
		header: 'Actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				ticketId: row.original.id
			});
		}
	}
];
