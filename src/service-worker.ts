/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files, '/_sw_appshell'];

sw.addEventListener('install', (event) => {
	sw.skipWaiting();
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		for (const url of ASSETS) {
			// force network. addAll seems to fetch but use chromes internal
			// http cache, which means we might get served old content??
			// TODO: this might be a caching issue on vercels end, regarding
			// cache control headers that make chrome cache on TOP of sw cache.
			const response = await fetch(url, { cache: 'reload' });
			if (response.ok) await cache.put(url, response);
		}
	}
	event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
		await sw.clients.claim();
	}
	event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);
			if (response) return response;
		}

		try {
			// see other { cache: 'reload' } comment above
			const response = await fetch(event.request, { cache: 'reload' });
			if (!(response instanceof Response)) throw new Error('invalid response from fetch');
			if (response.status === 200) cache.put(event.request, response.clone());
			return response;
		} catch (err) {
			const response = await cache.match(event.request);
			if (response) return response;

			if (event.request.mode === 'navigate') {
				const response = await cache.match('/_sw_appshell');
				const url = new URL(event.request.url);
				const slashes = url.pathname.split('/').length - 1;
				if (response && slashes === 1) return response; // / and /foo use ./ correctly
				if (response) {
					const responseClone = response.clone();
					let html = await responseClone.text();
					html = html
						// /foo/bar should use ../, /foo/bar/baz should use ../../, etc
						.replace(/"\.\/?/g, '"' + '../'.repeat(slashes - 1))
						.replace(/'\.\/?/g, "'" + '../'.repeat(slashes - 1));
					return new Response(html, {
						status: response.status,
						statusText: response.statusText,
						headers: response.headers
					});
				}
			}
			throw err;
		}
	}
	event.respondWith(respond());
});
