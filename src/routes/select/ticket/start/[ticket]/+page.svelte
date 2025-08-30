<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import FileClockIcon from '@lucide/svelte/icons/file-clock';
	import { Separator } from '$lib/components/ui/separator';

	//const { data }: PageProps = $props();
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
			<p>The exam is starting, you will be redirected shortly.</p>
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
