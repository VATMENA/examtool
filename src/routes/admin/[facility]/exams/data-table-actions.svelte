<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';

	interface Props {
		id: string,
	}
	let { id }: Props = $props();
</script>

<Button variant="outline" href="/admin/{page.params.facility}/exams/{id}/details">Edit Exam Details</Button>