import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await requireAuth(cookies);

	return {
		user: session.user
	}
}