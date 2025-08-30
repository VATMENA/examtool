<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import BookOpenCheckIcon from '@lucide/svelte/icons/book-open-check';
	import FileClockIcon from '@lucide/svelte/icons/file-clock';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
	import SquareKanbanIcon from '@lucide/svelte/icons/square-kanban';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import TicketCheckIcon from '@lucide/svelte/icons/ticket-check';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';
	import { Label } from '$lib/components/ui/label';
	import { onMount } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { browser } from '$app/environment';
	import { Badge } from '$lib/components/ui/badge';

	const { data }: PageProps = $props();

	async function saveCurrentQuestion() {
		const answerData = {
			multipleChoice: mcqEnteredAnswer
		};
		const answerDataString = JSON.stringify(answerData);

		const body = new SvelteURLSearchParams();
		body.set('answerData', answerDataString);

		await fetch('?', {
			method: 'POST',
			body: body.toString(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	}

	async function resetState() {
		mcqEnteredAnswer = null;
	}

	async function submitExam() {
		if (data.isReviewMode) return;
		if (browser) {
			await goto(`/exam/complete/${data.administrationId}`);
		}
	}

	function timeToGo() {
		// Utility to add leading zero
		function z(n) {
			return (n < 10 ? '0' : '') + n;
		}

		// Convert string to date object
		const d = new Date(data.expiryTime * 1000);
		let diff = d - new Date();

		if (diff < 0 && !data.isReviewMode) {
			submitExam();
		}

		// Allow for previous times
		const sign = diff < 0 ? '-' : '';
		diff = Math.abs(diff);

		// Get time components
		const hours = (diff / 3.6e6) | 0;
		const mins = ((diff % 3.6e6) / 6e4) | 0;
		const secs = Math.round((diff % 6e4) / 1e3);

		// Return formatted string
		return sign + z(hours) + ':' + z(mins) + ':' + z(secs);
	}

	let countdown = $state(timeToGo());
	if (!data.isReviewMode) {
		setInterval(() => {
			countdown = timeToGo();
		}, 1000);
	}

	function determineMcqState(typ: string, maybeAnswer: never): string | null {
		if (typ === 'multiple-choice' && maybeAnswer !== undefined && maybeAnswer !== null) {
			return maybeAnswer;
		} else {
			return null;
		}
	}

	let mcqEnteredAnswer: string | null = $derived(
		determineMcqState(data.strippedQuestionData.type, data.maybeAnswer)
	);
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center"
				>Question {data.questionNumber} of {data.totalQuestions}</Card.Title
			>
			<Card.Description class="text-center">
				{#if !data.isReviewMode}
					Taking {data.exam.name} - Exam ends in {countdown}
				{:else}
					Reviewing {data.exam.name}
				{/if}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			{#key data.strippedQuestionData}
				{#if data.strippedQuestionData.type === 'multiple-choice'}
					<h2 class="text-xl font-semibold">{data.strippedQuestionData.question}</h2>
					<RadioGroup.Root
						disabled={data.isReviewMode}
						onValueChange={saveCurrentQuestion}
						bind:value={mcqEnteredAnswer}
					>
						{#each data.strippedQuestionData.choices as choice, i (i)}
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value={i} id="r-{i}" />
								<Label for="r-{i}">{choice.text}</Label>
								{#if data.isReviewMode && choice.isCorrect}
									<Badge
										variant="secondary"
										class="bg-green-500/20 border-green-500 text-green-950 dark:text-green-50"
									>
										Correct
									</Badge>
								{/if}
							</div>
						{/each}
					</RadioGroup.Root>
				{/if}
			{/key}
		</Card.Content>
		<Card.Footer class="flex flex-col gap-2">
			<Separator class="mb-4" />
			<div class="flex flex-row justify-center gap-2">
				{#if data.questionNumber !== 1}
					<Button
						onclick={() => {
							resetState();
						}}
						variant="secondary"
						href="/exam/{data.ticketId}/{data.administrationId}/{data.questionNumber -
							2}{data.isReviewMode ? '?review' : ''}"
					>
						<ArrowLeftIcon />
						Previous question
					</Button>
				{/if}
				{#if data.questionNumber !== data.totalQuestions}
					<Button
						onclick={() => {
							resetState();
						}}
						variant="secondary"
						href="/exam/{data.ticketId}/{data.administrationId}/{data.questionNumber}{data.isReviewMode
							? '?review'
							: ''}"
					>
						Next question
						<ArrowRightIcon />
					</Button>
				{/if}

				{#if data.questionNumber === data.totalQuestions}
					{#if !data.isReviewMode}
						<Button href="/exam/{data.ticketId}/{data.administrationId}/review" variant="outline">
							Review and submit
							<ArrowRightIcon />
						</Button>
					{:else}
						<Button href="/instructor/report/{data.studentId}" variant="outline">
							Finish review
							<ArrowRightIcon />
						</Button>
					{/if}
				{/if}
			</div>
		</Card.Footer>
	</Card.Root>
</div>
