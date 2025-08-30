<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';

	interface Props {
		examId: string;
		questionId: string;
	}
	let { examId, questionId }: Props = $props();
</script>

<Button variant="outline" href="/admin/{page.params.facility}/exams/{examId}/questions/{questionId}"
	>Edit Question</Button
>
