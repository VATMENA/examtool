<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { examSchema } from '../examSchema';
	import type { PageProps } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data }: PageProps = $props();

	const form = superForm(data.form, {
		validators: zodClient(examSchema),
		async onUpdated({ form }) {
			if (form.valid) {
				await goto(`/admin/${page.params.facility}/exams`);
			}
		}
	});
	const { form: formData, enhance } = form;
</script>

<h1 class="text-2xl mb-4">New Exam</h1>

<form method="POST" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Exam Name</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.Description>Viewable to all who have access to the exam</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Input {...props} bind:value={$formData.description} />
			{/snippet}
		</Form.Control>
		<Form.Description>Viewable to all who have access to the exam</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="isRestricted" class="flex flex-row items-top justify-between">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Require instructor recommendation?</Form.Label>
				<Switch {...props} class="mt-1" bind:checked={$formData.isRestricted} />
			{/snippet}
		</Form.Control>
	</Form.Field>
	<Form.Field {form} name="numberOfQuestions">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Number Of Questions</Form.Label>
				<Input type="number" {...props} bind:value={$formData.numberOfQuestions} />
			{/snippet}
		</Form.Control>
		<Form.Description>Questions will be randomly selected from the question bank</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<div class="flex flex-row gap-2">
		<Form.Field {form} name="timeAlottedHrs">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Time Alotted (hours)</Form.Label>
					<Input type="number" {...props} bind:value={$formData.timeAlottedHrs} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="timeAlottedMins">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Time Alotted (minutes)</Form.Label>
					<Input type="number" {...props} bind:value={$formData.timeAlottedMins} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Form.Button>Create</Form.Button>
</form>
