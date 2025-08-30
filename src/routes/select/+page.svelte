<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import BookOpenCheckIcon from '@lucide/svelte/icons/book-open-check';
	import TicketCheckIcon from '@lucide/svelte/icons/ticket-check';
	import FileClockIcon from '@lucide/svelte/icons/file-clock';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
	import SquareKanbanIcon from '@lucide/svelte/icons/square-kanban';
	import { Separator } from '$lib/components/ui/separator';

	const { data }: PageProps = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center">Hello, {data.user.name_first}</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			{#if data.metRoleIn.length === 0}
				<div class="flex flex-col gap-1">
					<Button class="w-full" href="/select/selfadmitted">
						<BookOpenCheckIcon />
						Take a theoretical exam
					</Button>
				</div>

				<div class="flex flex-col gap-1">
					<Button variant="outline" class="w-full" href="/select/ticket">
						<TicketCheckIcon />
						I have an exam ticket
					</Button>
				</div>
			{:else}
				<p class="text-muted-foreground text-center">You are not a student in any facility. If you think this is in error, please contact the ATC Training Department.</p>
			{/if}
		</Card.Content>
		<Card.Footer class="flex flex-col gap-2">
			<Separator class="mb-4" />
			<div class="flex flex-row justify-center gap-2">
				<Button variant="secondary" href="/past_exams">
					<FileClockIcon />
					My past exams
				</Button>
			</div>
			{#if data.instructorIn || data.adminIn}
				<div class="flex flex-row justify-center gap-2">
					{#if data.instructorIn}
						<Button variant="secondary" href="/instructor">
							<GraduationCapIcon />
							Instructors
						</Button>
					{/if}
					{#if data.adminIn}
						<Button variant="secondary" href="/admin/{data.adminIn}/exams">
							<SquareKanbanIcon />
							Administrators
						</Button>
					{/if}
				</div>
			{/if}
		</Card.Footer>
	</Card.Root>
</div>
