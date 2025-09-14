import type { ColumnDef } from '@tanstack/table-core';
import type { examAvailableQuestion } from '$lib/server/db/schema';
import { renderComponent } from '$lib/components/ui/data-table';
import { questionTypes } from './questionSchema';
import type {
	FreeResponseQuestion,
	MultipleChoiceQuestion,
	Question as SQuestion
} from '$lib/question';
import DataTableActions from './data-table-actions.svelte';

export type Question = typeof examAvailableQuestion.$inferSelect;

export const columns: ColumnDef<Question>[] = [
	{
		header: 'Question ID',
		accessorKey: 'id'
	},
	{
		header: 'Question Type',
		cell: ({ row }) => {
			const q: SQuestion = row.original.questionData as SQuestion;
			// @ts-expect-error it's fine
			return questionTypes[q.type];
		}
	},
	{
		header: 'Question Summary',
		cell: ({ row }) => {
			const q: SQuestion = row.original.questionData as SQuestion;
			if (q.type === 'multiple-choice') {
				const q2: MultipleChoiceQuestion = q as MultipleChoiceQuestion;
				return q2.question;
			} else if (q.type === 'free-response') {
				const q2: FreeResponseQuestion = q as FreeResponseQuestion;
				return q2.question;
			} else {
				return 'Unknown';
			}
		}
	},
	{
		header: 'Actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				examId: row.original.examId,
				questionId: row.original.id
			});
		}
	}
];
