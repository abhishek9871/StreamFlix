// Service Worker for Cinematic TV - Smart TV Streaming App
// Optimized for slow internet connections and Smart TV performance

const CACHE_NAME = 'cinematic-tv-v1';
const RUNTIME_CACHE = 'runtime-v1';

// Resources to cache on install
const PRECACHE_RESOURCES = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Resources to cache at runtime
const RUNTIME_RESOURCES = [
    'https://api.themoviedb.org/3/',
    'https://image.tmdb.org/t/p/',
    'https://vidsrc.cc/'
];

// Install event - cache essential resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Pre-caching resources...');
                return cache.addAll(PRECACHE_RESOURCES);
            })
            .then(() => {
                console.log('Service Worker installed successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker installation failed:', error);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of resources with appropriate caching strategies
    if (isTMDBAPI(request.url)) {
        // API requests - Network first with cache fallback
        event.respondWith(networkFirstStrategy(request));
    } else if (isImageRequest(request.url)) {
        // Images - Cache first with network fallback
        event.respondWith(cacheFirstStrategy(request));
    } else if (isVideoRequest(request.url)) {
        // Video embeds - Network only (don't cache videos)
        event.respondWith(fetch(request));
    } else {
        // Static assets - Cache first
        event.respondWith(cacheFirstStrategy(request));
    }
});

// Caching Strategies

// Network First - Try network, fallback to cache
async function networkFirstStrategy(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        // Network failed, try cache
        console.log('Network failed, trying cache for:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline fallback for API requests
        if (isTMDBAPI(request.url)) {
            return createOfflineFallback(request);
        }
        
        throw error;
    }
}

// Cache First - Try cache, fallback to network
async function cacheFirstStrategy(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            // Serve from cache, then update in background
            updateCacheInBackground(request);
            return cachedResponse;
        }
        
        // Cache miss, try network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        console.error('Cache first strategy failed for:', request.url, error);
        
        // Return offline fallback for images
        if (isImageRequest(request.url)) {
            return createImageFallback();
        }
        
        throw error;
    }
}

// Update cache in background
async function updateCacheInBackground(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse);
        }
    } catch (error) {
        // Background update failed silently
        console.log('Background cache update failed:', error);
    }
}

// Helper Functions

function isTMDBAPI(url) {
    return url.includes('api.themoviedb.org');
}

function isImageRequest(url) {
    return url.includes('image.tmdb.org') || 
           url.includes('.jpg') || 
           url.includes('.png') || 
           url.includes('.webp') ||
           url.includes('.jpeg');
}

function isVideoRequest(url) {
    return url.includes('vidsrc.cc') || 
           url.includes('.mp4') || 
           url.includes('.webm') ||
           url.includes('.m3u8');
}

// Create offline fallback for API requests
function createOfflineFallback(request) {
    if (request.url.includes('/movie/popular')) {
        return new Response(JSON.stringify({
            results: generateOfflineMovies(),
            page: 1,
            total_pages: 1,
            total_results: 10
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    if (request.url.includes('/tv/popular')) {
        return new Response(JSON.stringify({
            results: generateOfflineTVShows(),
            page: 1,
            total_pages: 1,
            total_results: 10
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    if (request.url.includes('/search/')) {
        return new Response(JSON.stringify({
            results: [],
            page: 1,
            total_pages: 0,
            total_results: 0
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Default fallback
    return new Response(JSON.stringify({
        error: 'Offline - Content not available',
        message: 'Please check your internet connection'
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
    });
}

// Create image fallback
function createImageFallback() {
    // Return a 1x1 transparent pixel
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
            <rect width="300" height="450" fill="#333"/>
            <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#666" font-family="Arial" font-size="24">🎬</text>
        </svg>
    `;
    
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache'
        }
    });
}

// Generate offline content for demo purposes
function generateOfflineMovies() {
    return [
        {
            id: 1,
            title: "Offline Movie 1",
            poster_path: null,
            overview: "This is a demo movie for offline viewing.",
            release_date: "2023-01-01",
            vote_average: 7.5
        },
        {
            id: 2,
            title: "Offline Movie 2", 
            poster_path: null,
            overview: "Another demo movie for offline testing.",
            release_date: "2023-02-01",
            vote_average: 8.0
        }
    ];
}

function generateOfflineTVShows() {
    return [
        {
            id: 1,
            name: "Offline TV Show 1",
            poster_path: null,
            overview: "This is a demo TV show for offline viewing.",
            first_air_date: "2023-01-01",
            vote_average: 7.5
        },
        {
            id: 2,
            name: "Offline TV Show 2",
            poster_path: null, 
            overview: "Another demo TV show for offline testing.",
            first_air_date: "2023-02-01",
            vote_average: 8.0
        }
    ];
}

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_SIZE') {
        getCacheSize().then(size => {
            event.ports[0].postMessage({ cacheSize: size });
        });
    }
});

// Get cache size for monitoring
async function getCacheSize() {
    const cache = await caches.open(RUNTIME_CACHE);
    const requests = await cache.keys();
    let totalSize = 0;
    
    for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
        }
    }
    
    return totalSize;
}

console.log('Service Worker loaded and ready');