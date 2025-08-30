<script lang="ts">
	import type { PageProps } from './$types';
	import DataTable from '$lib/components/ui/data-table.svelte';
	import { columns } from './columns';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';

	const { data }: PageProps = $props();
</script>

<h1 class="text-2xl mb-4">Exam Questions: {data.thisExam.name}</h1>
<Button
	class="mb-4"
	variant="secondary"
	href="/admin/{page.params.facility}/exams/{data.thisExam.id}/questions/new">Add Question</Button
>
<DataTable data={data.thisExam.questions} {columns} />
