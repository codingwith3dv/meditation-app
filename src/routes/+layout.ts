import posthog from 'posthog-js';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load = (async () => {
	if (browser) {
		posthog.init('phc_rubavhSvLOxMUgekS6ojydS9TVTQxnDJCLe4O3KPt4o', {
			api_host: 'https://app.posthog.com'
		});
	}
	return;
}) satisfies LayoutLoad;
