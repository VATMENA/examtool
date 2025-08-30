<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';

	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';

	const { data }: PageProps = $props();

	function timeToGo() {
		// Utility to add leading zero
		function z(n) {
			return (n < 10 ? '0' : '') + n;
		}

		// Convert string to date object
		const d = new Date(data.expiryTime * 1000);
		let diff = d - new Date();

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
	setInterval(() => {
		countdown = timeToGo();
	}, 1000);

	async function submitExam() {
		await goto(`/exam/complete/${data.administrationId}`);
	}
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center">Review</Card.Title>
			<Card.Description class="text-center"
				>Taking {data.exam.name} - Exam ends in {countdown}</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<Alert.Root>
				<CircleCheckIcon />
				<Alert.Title>Check your answers</Alert.Title>
				<Alert.Description>
					<b class="text-green-700 dark:text-green-600">Your answers have been saved.</b>
					Feel free to review your answers before time elapses. Remember, there is no penalty for an
					incorrect answer, so an educated guess can only work in your favor.
					<b>After you submit, you will not be able to return to the exam questions.</b>
				</Alert.Description>
			</Alert.Root>
		</Card.Content>
		<Card.Footer class="flex flex-col gap-2">
			<Separator class="mb-4" />
			<div class="flex flex-row justify-center gap-2">
				<Button
					onclick={() => {
						resetState();
					}}
					variant="secondary"
					href="/exam/{data.ticketId}/{data.administrationId}/{data.totalQuestions - 1}"
				>
					<ArrowLeftIcon />
					Return to questions
				</Button>

				<Button class="hover:cursor-pointer" onclick={submitExam}>
					<CircleCheckIcon />
					Submit Exam
				</Button>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
