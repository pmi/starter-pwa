importScripts('https://unpkg.com/workbox-sw@2.0.1/build/importScripts/workbox-sw.prod.v2.0.1.js');

const swVersion = '{{appVersion}}';
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
    '{{baseUrl}}/browserconfig.xml',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
]);

workboxSW.router.setDefaultHandler({
    handler: workboxSW.strategies.cacheFirst()
});

workboxSW.router.registerRoute(
    '{{baseUrl}}/about',
    workboxSW.strategies.networkFirst()
);

workboxSW.router.registerRoute(
    '{{baseUrl}}/contact',
    workboxSW.strategies.networkFirst()
);

const channel = new BroadcastChannel('push-messages');

self.addEventListener('push', function (event) {

    const notification = JSON.parse(event.data.text());

    const title = notification.title;
    const options = {
        icon: notification.icon,
        badge: notification.badge,
        tag: notification.tag,
        body: notification.text,
        data: notification,
        actions: [
            {
                action: 'ok-action',
                title: 'OK',
                icon: '/images/demos/action-1-128x128.png'
            },
            {
                action: 'cancel-action',
                title: 'Cancel',
                icon: '/images/demos/action-2-128x128.png'
            }
        ]
    };

    channel.postMessage(notification);

    event.waitUntil(self.registration.showNotification(title, options));
});
