<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import FileClockIcon from '@lucide/svelte/icons/file-clock';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import { Separator } from '$lib/components/ui/separator';
	import * as devalue from 'devalue';
	import TicketCheckIcon from '@lucide/svelte/icons/ticket-check';
	import * as Alert from '$lib/components/ui/alert';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto } from '$app/navigation';

	const { data }: PageProps = $props();

	let ticket: string = $state('');

	let isValidTicket: boolean = $state(false);
	let examName: string = $state('');
	let valid_until: string = $state('');
	let instructor_name: string = $state('');
	let examTicket: string = $state('');

	async function checkTicket() {
		const formdata = new SvelteURLSearchParams();
		formdata.set('ticket', ticket);
		const r = await fetch('?', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formdata.toString()
		});
		const dataEncoded = (await r.json()).data;
		console.log(dataEncoded);
		const data = devalue.parse(dataEncoded);

		if (data === null) {
			isValidTicket = false;
			return;
		}

		examName = data.examData.name;
		valid_until = new Date(data.ticketData.validUntil * 1000).toLocaleDateString();
		instructor_name = data.instructorNameFirst + ' ' + data.instructorNameLast;
		examTicket = data.ticketData.ticket;
		isValidTicket = true;
	}

	async function startExam() {
		await goto(`/select/ticket/start/${examTicket}`);
	}
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
			<InputOTP.Root onValueChange={checkTicket} bind:value={ticket} maxlength={6}>
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

			{#if isValidTicket}
				<Alert.Root>
					<TicketCheckIcon />
					<Alert.Title><b>{examName}</b> exam</Alert.Title>
					<Alert.Description class="flex flex-col gap-2">
						<div>
							Ticket valid for <b>{data.user.name_first} {data.user.name_last}</b> until {valid_until},
							issued by {instructor_name}
						</div>
					</Alert.Description>
				</Alert.Root>

				<Button class="w-full" onclick={startExam}>Start Exam &rarr;</Button>
			{:else}
				<Button class="w-full" disabled>Enter a valid exam ticket to view exam details</Button>
			{/if}
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
