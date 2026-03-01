/* ============================================
   fernan.dev - Service Worker
   Caches static assets for offline support and faster loading
   ============================================ */

const CACHE_NAME = 'fernan-dev-v1';
const STATIC_ASSETS = [
	'/',
	'/index.html',
	'/tools/',
	'/articles/',
	'/resources/',
	'/styles/main.css',
	'/scripts/main.js',
	'/fonts/outfit.ttf',
	'/fonts/emoji.ttf',
	'/fonts/FiraCode.ttf',
	'/favicon/favicon.svg',
	'/favicon/favicon.ico',
	'/favicon/apple-touch-icon.png',
	'/svgs/logo.svg',
	'/svgs/plus.svg',
	'/svgs/f.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => {
				console.log('[Service Worker] Caching static assets');
				return cache.addAll(STATIC_ASSETS);
			})
			.catch((error) => {
				console.error('[Service Worker] Failed to cache assets:', error);
			})
	);
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter((name) => name !== CACHE_NAME)
						.map((name) => {
							console.log('[Service Worker] Deleting old cache:', name);
							return caches.delete(name);
						})
				);
			})
			.then(() => {
				console.log('[Service Worker] Activated');
				self.clients.claim();
			})
	);
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
	// Skip non-GET requests
	if (event.request.method !== 'GET') return;

	// Skip cross-origin requests
	const requestUrl = new URL(event.request.url);
	if (requestUrl.origin !== location.origin) return;

	event.respondWith(
		caches.match(event.request)
			.then((cachedResponse) => {
				if (cachedResponse) {
					// Return cached response and update cache in background
					event.waitUntil(updateCache(event.request));
					return cachedResponse;
				}

				// Not in cache - fetch from network
				return fetch(event.request)
					.then((networkResponse) => {
						// Don't cache non-successful responses
						if (!networkResponse || networkResponse.status !== 200) {
							return networkResponse;
						}

						// Clone the response for caching
						const responseToCache = networkResponse.clone();

						event.waitUntil(
							caches.open(CACHE_NAME)
								.then((cache) => {
									return cache.put(event.request, responseToCache);
								})
						);

						return networkResponse;
					})
					.catch((error) => {
						console.error('[Service Worker] Fetch failed:', error);
						// Return offline fallback if available
						return caches.match('/index.html');
					});
			})
	);
});

// Update cache in background (stale-while-revalidate)
async function updateCache(request) {
	try {
		const response = await fetch(request);
		const cache = await caches.open(CACHE_NAME);
		await cache.put(request, response);
	} catch (error) {
		// Network error - ignore, we have cached version
		console.log('[Service Worker] Background update failed:', error);
	}
}
