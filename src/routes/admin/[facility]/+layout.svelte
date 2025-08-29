<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "./app-sidebar.svelte";
	import type { LayoutData } from "./$types";

	const { children, data }: LayoutData = $props();
</script>

<Sidebar.Provider>
	<AppSidebar cfId={data.cfId} availableFacilities={data.availableFacilities} currentFacility={data.currentFacility} />
	<main class="p-4">
		{@render children?.()}
	</main>
</Sidebar.Provider>