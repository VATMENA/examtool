<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl text-center">Divisional Theoretical Exams</Card.Title>
			<Card.Description class="text-center">Log in to take written exams</Card.Description>
		</Card.Header>
		<Card.Content>
			<Button href={data.start_flow_url} class="w-full">Log in with VATSIM</Button>
		</Card.Content>
	</Card.Root>
</div>
