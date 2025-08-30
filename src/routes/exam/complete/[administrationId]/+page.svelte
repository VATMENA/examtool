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
	import PartyPopperIcon from '@lucide/svelte/icons/party-popper';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';
	import { Label } from '$lib/components/ui/label';
	import { onMount } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
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
						>Exam failed with a score of {(data.score * 100).toFixed(2)}% (80% needed to pass). An
						instructor may authorize a retake.</Alert.Description
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
