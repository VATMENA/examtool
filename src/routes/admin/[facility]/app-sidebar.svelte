<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import FacilitySelector from './facility-selector.svelte';
	import { page } from '$app/state';

	interface Props {
		availableFacilities: string[];
		currentFacility: string;
		cfId: string;
	}
	const { availableFacilities, currentFacility, cfId }: Props = $props();
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<FacilitySelector facilities={availableFacilities} defaultFacility={currentFacility} />
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Facility Exams</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={page.url.pathname.startsWith(`/admin/${cfId}/exams`)}>
							{#snippet child({ props })}
								<a href="/admin/{cfId}/exams" {...props}>Available Exams</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<!--
		<Sidebar.Group>
			<Sidebar.GroupLabel>Tickets</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>

					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={page.url.pathname.startsWith(`/admin/${cfId}/tickets`)}>
							{#snippet child({ props })}
								<a href="/admin/{cfId}/tickets" {...props}>Active Tickets</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={page.url.pathname.startsWith(`/admin/${cfId}/tickets/old`)}>
							{#snippet child({ props })}
								<a href="/admin/{cfId}/tickets/old" {...props}>Expired Tickets</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>

				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>


		<Sidebar.Group>
			<Sidebar.GroupLabel>Facility Management</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>

					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={page.url.pathname.startsWith(`/admin/${cfId}/users`)}>
							{#snippet child({ props })}
								<a href="/admin/{cfId}/users" {...props}>User Management</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>

					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={page.url.pathname.startsWith(`/admin/${cfId}/audit`)}>
							{#snippet child({ props })}
								<a href="/admin/{cfId}/audit" {...props}>Audit Logs</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>

				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		-->

		<Sidebar.Group>
			<Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href="/select" {...props}>Back to public area</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
