<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import type { PageProps } from "./$types";
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { questionSchema, questionTypes } from '../questionSchema';
	import * as Select from "$lib/components/ui/select";
	import { Button } from '$lib/components/ui/button';
	import CheckIcon from '@lucide/svelte/icons/check';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import { Toggle } from '$lib/components/ui/toggle';

	let { data }: PageProps = $props();

	const form = superForm(data.form, {
		validators: zodClient(questionSchema),
		dataType: "json",
		async onUpdated({ form }) {
			if (form.valid) {
				await goto(`/admin/${page.params.facility}/exams/${page.params.examId}/questions`);
			}
		}
	});
	const { form: formData, enhance, delayed } = form;


</script>

<h1 class="text-2xl mb-4">New Exam Question: {data.thisExam.name}</h1>

<form method="POST" class="space-y-2" use:enhance>
	<Form.Field {form} name="type">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Question Type</Form.Label>
				<Select.Root
					type="single"
					bind:value={$formData.type}
					name={props.name}
				>
					<Select.Trigger {...props}>
						{$formData.type
							? questionTypes[$formData.type]
							: "Select a question type"}
					</Select.Trigger>
					<Select.Content>
						{#each Object.entries(questionTypes) as [k, v] (k)}
							<Select.Item value={k} label={v} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Multiple Choice -->
	{#if $formData.type === "multiple-choice"}
		<Form.Field {form} name="question">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Question Text</Form.Label>
					<Input {...props} bind:value={$formData.question} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Button variant="secondary" onclick={() => {$formData.choices.push({ text: "New answer choice", isCorrect: false }); $formData.choices = $formData.choices}}>New Answer Choice</Button>

		{#each $formData.choices as choice, i (i)}
			<div class="flex flex-row gap-2">
				<Form.Field {form} name="choices[{i}].text">
					<Form.Control>
						{#snippet children({props})}
							<Form.Label>Option {i+1}</Form.Label>
							<Input {...props} bind:value={choice.text} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field class="mt-5.5" {form} name="choices[{i}].isCorrect">
					<Form.Control>
						{#snippet children({ props })}
							<Toggle {...props} bind:pressed={choice.isCorrect}><CheckIcon /></Toggle>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Button size="icon" onclick={() => {$formData.choices.splice(i, 1); $formData.choices = $formData.choices;}} variant="ghost" class="mt-5.5">
					<TrashIcon />
				</Button>
			</div>
		{/each}
	{/if}

	<Form.Button>
		Create
	</Form.Button>
</form>