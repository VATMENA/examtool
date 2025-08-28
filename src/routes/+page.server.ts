import type { PageServerLoad } from "./$types";
import { PUBLIC_VATSIM_OAUTH_CLIENT_ID, PUBLIC_VATSIM_OAUTH_BASE, PUBLIC_VATSIM_OAUTH_REDIRECT_URI } from "$env/static/public";
import { checkAuth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const maybeSession = await checkAuth(cookies, false);
	if (maybeSession) {
		redirect(301, "/select");
	}

	const oauth_parameters = new URLSearchParams();
	oauth_parameters.set("response_type", "code");
	oauth_parameters.set("client_id", PUBLIC_VATSIM_OAUTH_CLIENT_ID);
	oauth_parameters.set("scope", "full_name vatsim_details");
	oauth_parameters.set("redirect_uri", PUBLIC_VATSIM_OAUTH_REDIRECT_URI);

	const oauth_url = new URL(PUBLIC_VATSIM_OAUTH_BASE);
	oauth_url.pathname = "/oauth/authorize";
	oauth_url.search = oauth_parameters.toString();

	return {
		start_flow_url: oauth_url.toString()
	}
}