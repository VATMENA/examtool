<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		name: string,
		id: number
	}
	let { name, id }: Props = $props();
</script>

<a href="/admin/{page.params.facility}/exams/{id}" class="hover:underline underline-offset-4 font-semibold">{name}</a>