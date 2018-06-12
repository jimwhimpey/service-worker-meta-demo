const CACHE_KEY = 'test';

self.addEventListener('install', (event) => {

	const request = new Request('./script.js');

	// Add some meta data we want to persist through the cache
	request['time_cached'] = new Date();
	request['meta'] = 'Jim’s meta';

	// Right here we have that data
	console.log("install time meta: request['time_cached']", request['time_cached']);
	console.log("install time meta: request['meta']", request['meta']);

	event.waitUntil(fetch(request).then(networkResponse => caches.open(CACHE_KEY).then((cache) => {

		// Try attaching some meta to the response too.
		networkResponse['time_cached'] = new Date();
		networkResponse['meta'] = 'Jim’s meta';

		// Right here we have that data
		console.log("install time meta: networkResponse['time_cached']", networkResponse['time_cached']);
		console.log("install time meta: networkResponse['meta']", networkResponse['meta']);

		cache.put(request, networkResponse);

	})));

});

self.addEventListener('fetch', (event) => {

	const request = event.request;

	event.respondWith(
		caches.open(CACHE_KEY).then(cache => cache.match(request)).then(response => {

			if (response) {

				// There's no meta data =(
				console.log("fetch time meta: request['time_cached']", request['time_cached']);
				console.log("fetch time meta: request['meta']", request['meta']);
				console.log("fetch time meta: response['time_cached']", response['time_cached']);
				console.log("fetch time meta: response['meta']", response['meta']);

				return response;

			} else {
				return fetch(request);
			}

		})
	);

});
