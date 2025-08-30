<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';

	const { data }: PageProps = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">VATMENA Knowledge Exams</Card.Title>
			<Card.Description>Log in to take written exams</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-2">
			{#if data.success}
				<Alert.Root>
					<CheckCircle2Icon />
					<Alert.Title>Success!</Alert.Title>
					<Alert.Description>You will be redirected shortly.</Alert.Description>
				</Alert.Root>
				<Button href="/select" variant="outline" class="w-full"
					>Click here if the page doesn't load</Button
				>
			{:else}
				<Alert.Root variant="destructive">
					<AlertCircleIcon />
					<Alert.Title>Error in login</Alert.Title>
					{#if data.error}
						<Alert.Description>{data.error}</Alert.Description>
					{:else}
						<Alert.Description>An unknown error occurred.</Alert.Description>
					{/if}
				</Alert.Root>
				<Button href="/" variant="outline" class="w-full">Try again</Button>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
