<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import BookOpenCheckIcon from '@lucide/svelte/icons/book-open-check';
	import OctagonMinusIcon from '@lucide/svelte/icons/octagon-minus';

	interface Props {
		isRestricted: boolean;
	}
	let { isRestricted }: Props = $props();
</script>

{#if isRestricted}
	<Badge
		variant="outline"
		class="bg-red-500/30 border-red-500/60 text-white dark:bg-red-600/30 dark:border-red-600/60"
	>
		<OctagonMinusIcon />
		Restricted
	</Badge>
{:else}
	<Badge
		variant="outline"
		class="bg-blue-500/30 border-blue-500/60 text-white dark:bg-blue-600/30 dark:border-blue-600/60"
	>
		<BookOpenCheckIcon />
		Public
	</Badge>
{/if}
