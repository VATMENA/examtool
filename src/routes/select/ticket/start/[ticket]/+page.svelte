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
	import TicketCheckIcon from '@lucide/svelte/icons/ticket-check';
	import { Separator } from '$lib/components/ui/separator';

	const { data }: PageProps = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center">Enter exam ticket</Card.Title>
			<Card.Description
				>If your instructor gave you a code to start a restricted exam, enter it here. Exam tickets
				are one-time and specific to each user and exam.</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4 items-center">
			<InputOTP.Root maxlength={6}>
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells.slice(0, 3) as cell (cell)}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
					<InputOTP.Separator />
					<InputOTP.Group>
						{#each cells.slice(3, 6) as cell (cell)}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>

			<!--

			<Alert.Root>
				<TicketCheckIcon />
				<Alert.Title>Ticket valid for <b>I1 - Instructor</b> exam</Alert.Title>
				<Alert.Description class="flex flex-col gap-2">
					<div>
						<b>50 questions</b> - <b>2 hours</b>
					</div>
					<div>Ticket valid for <b>Web Eight</b> until 01 September 2025, issued by Web Eight</div>
				</Alert.Description>
			</Alert.Root>

			<Button class="w-full">Start Exam &rarr;</Button>
			-->

			<Button class="w-full" disabled>Enter a valid exam ticket to view exam details</Button>
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
