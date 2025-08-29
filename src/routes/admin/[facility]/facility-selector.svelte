<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import { goto } from '$app/navigation';
	import { facilities as dFacilities } from '$lib/facilities';

	let { facilities, defaultFacility }: { facilities: string[]; defaultFacility: string } = $props();
	let selectedFacility = $state(defaultFacility);
</script>
<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<GalleryVerticalEndIcon class="size-4" />
						</div>
						<div class="flex flex-col gap-0.5 leading-none">
							<span class="font-semibold">Knowledge Tests</span>
							<span class="">{selectedFacility}</span>
						</div>
						<ChevronsUpDownIcon class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)" align="start">
				{#each facilities as facility (facility)}
					<DropdownMenu.Item onSelect={async () => {
						selectedFacility = facility;
						for (const [facilityId, facilityName] of Object.entries(dFacilities)) {
							if (selectedFacility === facilityName) {
								await goto(`/admin/${facilityId}/exams`);
							}
						}
					}}>
						{facility}
						{#if facility === selectedFacility}
							<CheckIcon class="ml-auto" />
						{/if}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>