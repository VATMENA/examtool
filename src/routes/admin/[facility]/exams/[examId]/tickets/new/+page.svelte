<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { PageProps } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { ticketSchema } from '../ticketSchema';

	let { data }: PageProps = $props();

	const form = superForm(data.form, {
		validators: zodClient(ticketSchema),
		dataType: 'json',
		async onUpdated({ form }) {
			if (form.valid) {
				await goto(`/admin/${page.params.facility}/exams/${page.params.examId}/tickets`);
			}
		}
	});
	const { form: formData, enhance } = form;
</script>

<h1 class="text-2xl mb-4">Issue Exam Ticket: {data.thisExam.name}</h1>

<form method="POST" class="space-y-2" use:enhance>
	<Form.Field {form} name="userId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Student CID</Form.Label>
				<Input type="number" {...props} bind:value={$formData.userId} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
		<Form.Description>Ticket will be valid for 7 days</Form.Description>
	</Form.Field>

	<Form.Button>Issue Ticket</Form.Button>
</form>
