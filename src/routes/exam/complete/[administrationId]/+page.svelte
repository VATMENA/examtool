<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	import PartyPopperIcon from '@lucide/svelte/icons/party-popper';

	import { Separator } from '$lib/components/ui/separator';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import CircleXIcon from '@lucide/svelte/icons/circle-x';

	const { data }: PageProps = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center">Exam Results: {data.exam.name}</Card.Title>
			<Card.Description class="text-center"
				>Exam administration #{data.administrationId}</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			{#if data.hasPendingGrade}
				<Alert.Root>
					<ClockIcon />
					<Alert.Title>Grade is pending</Alert.Title>
					<Alert.Description
						>Your exam must be graded manually by an instructor. Check back occasionally for when
						your grade will be posted.</Alert.Description
					>
				</Alert.Root>
			{:else if data.score >= data.passingScore}
				<Alert.Root
					class="bg-green-400/10 border-green-400 dark:bg-green-900/10 dark:border-green-700"
				>
					<PartyPopperIcon />
					<Alert.Title>Congratulations!</Alert.Title>
					<Alert.Description
						>Exam passed with a score of {(data.score * 100).toFixed(2)}%.</Alert.Description
					>
				</Alert.Root>
			{:else}
				<Alert.Root class="bg-red-400/10 border-red-400 dark:bg-red-900/10 dark:border-red-700">
					<CircleXIcon />
					<Alert.Title>Exam failed</Alert.Title>
					<Alert.Description
						>Exam failed with a score of {(data.score * 100).toFixed(2)}% (80% needed to pass).
						{#if data.exam.isRestricted}
							An instructor may authorize a retake.
						{:else}
							You may retake the exam after 24/72 hours depending on your number of previous attempts.
							Study and try again soon!
						{/if}
					</Alert.Description
					>
				</Alert.Root>
			{/if}
		</Card.Content>
		<Card.Footer class="flex flex-col gap-2">
			<Separator class="mb-4" />
			<div class="flex flex-row justify-center gap-2">
				<Button variant="secondary" href="/select">
					<ArrowLeftIcon />
					Back to homepage
				</Button>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
