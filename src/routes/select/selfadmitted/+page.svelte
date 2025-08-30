<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import * as Alert from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";
	import type { PageProps } from './$types';
	import BookOpenCheckIcon from "@lucide/svelte/icons/book-open-check";
	import FileClockIcon from "@lucide/svelte/icons/file-clock";
	import GraduationCapIcon from "@lucide/svelte/icons/graduation-cap";
	import SquareKanbanIcon from "@lucide/svelte/icons/square-kanban";
	import * as InputOTP from "$lib/components/ui/input-otp";
	import TicketCheckIcon from "@lucide/svelte/icons/ticket-check";
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	import { Separator } from '$lib/components/ui/separator';
	import { facilities } from '$lib/facilities';

	const { data }: PageProps = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center">Select public exam</Card.Title>
			<Card.Description class="text-center">The following exams are available to you.</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4 items-center">
			{#each data.userAvailableExams as exam (exam.id)}
				<Button variant="outline" href="/select/selfadmitted/{exam.id}">Take {exam.name} ({facilities[exam.facilityId]}) &rarr;</Button>
			{:else}
				<p class="text-center text-muted-foreground">No exams are available to you at this time.</p>
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