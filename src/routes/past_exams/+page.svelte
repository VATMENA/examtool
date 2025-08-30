<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed';
	import * as Alert from '$lib/components/ui/alert';
	import CircleXIcon from '@lucide/svelte/icons/circle-x';
	import ClockIcon from '@lucide/svelte/icons/clock';

	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';

	const { data }: PageProps = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center">My past exams</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			{#each data.pastExams as exam (exam.id)}
				<Alert.Root>
					<Alert.Title class="flex flex-row justify-between">
						{exam.exam.name}
						{#if !exam.isSubmitted}
							<Badge variant="outline">
								<CircleDashedIcon />
								In Progress
							</Badge>
						{:else if exam.isPending}
							<Badge variant="secondary">
								<ClockIcon />
								Grade Pending
							</Badge>
						{:else if exam.isPassed}
							<Badge
								variant="secondary"
								class="bg-green-500/20 border-green-500 text-green-950 dark:text-green-50  font-semibold dark:bg-green-600/20 dark:border-green-600"
							>
								<CircleCheckIcon />
								Passed
							</Badge>
						{:else}
							<Badge
								variant="secondary"
								class="bg-red-500/20 border-red-500 text-red-950 dark:text-red-50  font-semibold dark:bg-red-600/20 dark:border-red-600"
							>
								<CircleXIcon />
								Failed
							</Badge>
						{/if}
					</Alert.Title>
					<Alert.Description>
						{new Date(exam.startTime * 1000).toLocaleDateString()} - Exam ID#{exam.id}-{exam.ticketId}
					</Alert.Description>
				</Alert.Root>
			{:else}
				<p class="text-center text-muted-foreground">You have not taken any exams.</p>
			{/each}
		</Card.Content>
		<Card.Footer class="flex flex-col gap-2">
			<Separator class="mb-4" />
			<div class="flex flex-row justify-center gap-2">
				<Button variant="secondary" href="/select">
					<ArrowLeftIcon />
					Go back
				</Button>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
