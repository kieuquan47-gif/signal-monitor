const CACHE_NAME = "signal-monitor-v2";
const ASSETS = ["./", "./index.html", "./manifest.json", "icon-192.png", "icon-512.png", "./alarm.mp3"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Không cache các yêu cầu API lấy trạng thái thời gian thực
    if (event.request.url.includes("/api/") || event.request.method !== "GET") {
        return;
    }
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});