importScripts('https://unpkg.com/workbox-sw@2.0.1/build/importScripts/workbox-sw.prod.v2.0.1.js');

const workboxSW = new self.WorkboxSW({
    skipWaiting: true,
    clientsClaim: true
});

// This is a placeholder for manifest dynamically injected from webpack.config.js
workboxSW.precache([]);

// Here we precache urls that are generated dynamically in the main.js controller
workboxSW.precache([
    '{{{preCacheRoot}}}',
    '{{baseUrl}}/manifest.json',
    '{{baseUrl}}/browserconfig.xml'
]);

workboxSW.router.registerRoute(
    'http://ip-api.com/json',
    workboxSW.strategies.cacheFirst()
);
