import type { PageServerLoad, Actions } from "./$types";
import { currentTimestamp, requireAuth, requireRole } from '$lib/auth';
import { ROLE_ADMIN } from '$lib/authShared';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { examSchema } from '../../examSchema';
import { db } from '$lib/server/db';
import { auditLogEntry, exam } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = await requireRole(requireAuth(cookies), ROLE_ADMIN);
	if (!session.metRoleIn.includes(params.facility)) { redirect(301, "/select"); }

	const thisExam = await db.query.exam.findFirst({
		where: eq(exam.id, Number.parseInt(params.examId))
	});

	if (!thisExam) {
		redirect(301, `/admin/${params.facility}/exams`);
	}

	return {
		form: await superValidate(thisExam, zod(examSchema))
	}
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(examSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const session = await requireRole(requireAuth(event.cookies), ROLE_ADMIN);
		if (!session.metRoleIn.includes(event.params.facility)) { redirect(301, "/select"); }

		const data = await db.update(exam)
			.set({
				name: form.data.name,
				description: form.data.description,
				isRestricted: form.data.isRestricted,
				facilityId: event.params.facility
			})
			.where(eq(exam.id, Number.parseInt(event.params.examId)))
			.returning();

		await db.insert(auditLogEntry)
			.values({
				timestamp: currentTimestamp(),
				userId: session.user.id,
				action: `Updated exam ${form.data.name}`,
				data,
				facilityId: event.params.facility
			});

		return { form };
	}
}