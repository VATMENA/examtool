<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import type { PageProps } from './$types';
	import BookOpenCheckIcon from "@lucide/svelte/icons/book-open-check";
	import TicketCheckIcon from "@lucide/svelte/icons/ticket-check";
	import FileClockIcon from "@lucide/svelte/icons/file-clock";
	import GraduationCapIcon from "@lucide/svelte/icons/graduation-cap";
	import SquareKanbanIcon from "@lucide/svelte/icons/square-kanban";
	import ClipboardListIcon from "@lucide/svelte/icons/clipboard-list";
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { Separator } from '$lib/components/ui/separator';
	import { facilities } from '$lib/facilities';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	const { data }: PageProps = $props();

	let userId = $state();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center">Access student exam report</Card.Title>
			<Card.Description class="text-center">Data will be shown for {data.rolesIn.map((u) => facilities[u]).join(", ")} exams</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<div class="flex flex-col gap-1">
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="cid">Student CID</Label>
					<Input bind:value={userId} type="number" id="cid" placeholder="1543186" />
				</div>
				<Button class="w-full" href="/instructor/report/{userId}">
					<ClipboardListIcon />
					View report
				</Button>
			</div>
		</Card.Content>
		<Card.Footer class="flex flex-col gap-2">
			<Separator class="mb-4" />
			<div class="flex flex-row justify-center gap-2">
				<Button variant="secondary" href="/instructor">
					<ArrowLeftIcon />
					Go back
				</Button>
			</div>
		</Card.Footer>
	</Card.Root>
</div>