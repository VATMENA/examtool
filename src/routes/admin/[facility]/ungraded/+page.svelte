<script lang="ts">
	import type { PageProps } from './$types';
	import DataTable from '$lib/components/ui/data-table.svelte';
	import { columns } from './columns';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';

	const { data }: PageProps = $props();
</script>

<h1 class="text-2xl mb-4">Ungraded Exams</h1>
<DataTable data={data.pendingAdministrationsHere} {columns} />