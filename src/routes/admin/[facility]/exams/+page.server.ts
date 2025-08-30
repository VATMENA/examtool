import type { PageServerLoad } from './$types';
import { requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN } from '$lib/authShared';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { exam } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_ADMIN);
	if (!session.metRoleIn.includes(params.facility)) {
		redirect(301, '/select');
	}

	const examsHere = await db.query.exam.findMany({
		where: eq(exam.facilityId, params.facility)
	});

	return {
		examsHere
	};
};
