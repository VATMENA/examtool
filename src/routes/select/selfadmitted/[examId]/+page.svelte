<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import BookOpenCheckIcon from '@lucide/svelte/icons/book-open-check';
	import FileClockIcon from '@lucide/svelte/icons/file-clock';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
	import SquareKanbanIcon from '@lucide/svelte/icons/square-kanban';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import TicketCheckIcon from '@lucide/svelte/icons/ticket-check';
	import * as Alert from '$lib/components/ui/alert';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { Separator } from '$lib/components/ui/separator';
	import { facilities } from '$lib/facilities';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	const { data }: PageProps = $props();

	const convertSeconds = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		let result = '';

		if (hours > 0) {
			result += `${hours} hr`;
		}

		if (hours > 0 && minutes > 0) {
			result += ' ';
		}

		if (minutes > 0) {
			result += `${minutes} min`;
		}

		return result;
	};

	let agreedToTerms = $state(false);

	function startExam() {
		// "Self-admitted" exams really just generate an exam ticket and then immediately redeem it.
		// Simpler to implement code-wise.
	}
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center">{data.thisExam.name}</Card.Title>
			<Card.Description class="text-center">
				<b>{data.numberOfQuestions} questions</b> -
				<b>{convertSeconds(data.thisExam.examTimeAlotted)}</b>
				<br />
				{data.thisExam.description}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4 items-center">
			<Alert.Root>
				<AlertCircleIcon />
				<Alert.Title>Ensure you have enough time</Alert.Title>
				<Alert.Description>
					Once you start the exam, you will not be able to pause the timer. If you do not have time
					for this exam, return here later. <b
						>Your timer will not start until you press "Start Exam" below.</b
					>
				</Alert.Description>
			</Alert.Root>
			<div class="flex items-start gap-3">
				<Checkbox id="terms-2" bind:checked={agreedToTerms} />
				<div class="grid gap-2">
					<Label for="terms-2 font-semibold"
						>I agree to follow exam rules and keep exam contents confidential</Label
					>
					<p class="text-muted-foreground text-sm">
						Sharing test questions, answers, stimuli, or any other exam content is strictly
						prohibited.
					</p>
				</div>
			</div>
			<form method="POST" action="?">
				<Form.Button class="w-full" disabled={!agreedToTerms}>
					{#if !agreedToTerms}
						Agree to the rules to start the exam
					{:else}
						Start Exam &rarr;
					{/if}
				</Form.Button>
			</form>
		</Card.Content>
		<Card.Footer class="flex flex-col gap-2">
			<Separator class="mb-4" />
			<div class="flex flex-row justify-center gap-2">
				<Button variant="secondary" href="/select">
					<FileClockIcon />
					Go back
				</Button>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
