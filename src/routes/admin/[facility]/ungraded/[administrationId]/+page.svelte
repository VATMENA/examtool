<script lang="ts">
	import type { PageProps } from './$types';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { gradingSchema } from './gradingSchema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';

	const { data }: PageProps = $props();

	const form = superForm(data.form, {
		dataType: "json",
		validators: zodClient(gradingSchema),
	});
	const { form: formData, enhance }	= form;
</script>

<h1 class="text-2xl mb-4">Grade Exam</h1>
<form method="POST" use:enhance class="flex flex-col gap-4">
	{#each Object.entries($formData.data) as [key, value] (key)}
		<div class="flex flex-row items-baseline gap-3">
			<div class="flex flex-col">
				<h3 class="font-semibold">Question: {value.question}</h3>
				<p>Student response: {value.answer}</p>
			</div>
			<div class="flex flex-row gap-2">
				<Form.Field {form} name="data[{key}].pointsGiven}">
					<Form.Control>
						{#snippet children({ props })}
							<!--<Form.Label class="mt-2">Points Earned (of {value.pointsPossible} possible)</Form.Label>-->
							<Input type="number" min={0} max={value.pointsPossible} {...props} bind:value={$formData.data[key].pointsGiven} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<p class="text-sm">of {value.pointsPossible}</p>
			</div>
		</div>

	{/each}
	<Form.Button>Grade Exam and Release Score</Form.Button>
</form>
