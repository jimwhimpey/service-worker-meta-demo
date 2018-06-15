const CACHE_KEY = 'test';

self.addEventListener('install', (event) => {

	const request = new Request('./script.js');

	event.waitUntil(fetch(request).then(networkResponse => caches.open(CACHE_KEY).then((cache) => {

		const customHeaders = new Headers({
			'Content-Type': 'text/plain',
			'Time-Cached': new Date(),
			'Meta': 'Jims',
		});

		const customResponseData = {
			status: 200,
			statusText: "OK",
			headers: customHeaders,
		};

		const customResponse = new Response(networkResponse.body, customResponseData);

		return cache.put(request, customResponse);

	})));

});

self.addEventListener('fetch', (event) => {

	const request = event.request;

	event.respondWith(
		caches.open(CACHE_KEY).then(cache => cache.match(request)).then(response => {

			if (response) {

				console.log("Time-Cached", response.headers.get('Time-Cached'));
				console.log("Meta", response.headers.get('Meta'));
				return response;

			} else {
				return fetch(request);
			}

		})
	);

});
