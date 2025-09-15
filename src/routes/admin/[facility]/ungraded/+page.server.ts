import type { PageServerLoad } from './$types';
import { requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN } from '$lib/authShared';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import {
	exam,
	examAdministration,
	examAdministrationAnswer,
	examAvailableQuestion
} from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_ADMIN);
	if (!session.metRoleIn.includes(params.facility)) {
		redirect(301, '/select');
	}

	const pendingAdministrations = await db.query.examAdministration.findMany({
		where: and(
			eq(examAdministration.isSubmitted, true),
			eq(examAdministration.hasPendingGrade, true),
		),
		with: {
			exam: true
		}
	});
	const pendingAdministrationsHere = pendingAdministrations.filter((u) =>
		u.exam.facilityId === params.facility
	);

	return {
		pendingAdministrationsHere
	};
};
