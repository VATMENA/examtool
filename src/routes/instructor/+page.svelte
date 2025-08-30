<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import ClipboardListIcon from '@lucide/svelte/icons/clipboard-list';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { Separator } from '$lib/components/ui/separator';
	import { facilities } from '$lib/facilities';

	const { data }: PageProps = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center">Instructor Dashboard</Card.Title>
			<Card.Description class="text-center"
				>Instructor for {data.rolesIn.map((u) => facilities[u]).join(', ')} exams</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<div class="flex flex-col gap-1">
				<Button variant="outline" class="w-full" href="/instructor/report">
					<ClipboardListIcon />
					Retrieve student exam report
				</Button>
			</div>
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
