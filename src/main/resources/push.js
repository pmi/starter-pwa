var notifications = require('/lib/notifications');
var helper = require('/lib/helper');

var keyPair;
var shieldUrl = '';//helper.getPrecacheUrl() + 'icons/xp-shield.png';

function generateKeys() {
    keyPair = notifications.generateKeyPair();

    log.info('Generated keys: ' + JSON.stringify(keyPair));

    return {
        publicKey: keyPair.publicKey,
    };
}

function subscribe(req) {
    var sub = {
        endpoint: req.params.endpoint,
        auth: req.params.auth,
        receiverKey: req.params.receiverKey
    };

    subscriptions.push(sub);

    log.info('Got subscription details from UI: ' + JSON.stringify(sub));

    return sub;
}

function unsubscribe(req) {
    subscriptions = subscriptions.filter(function (sub) {
        return sub.endpoint !== req.params.endpoint;
    });
}

var subscriptions = [];

function notify(text) {
    subscriptions.forEach(function (sub) {
        pushNotification(sub, text);
    });
}

function pushNotification(sub, text) {
    log.info('push: ' + JSON.stringify(sub) + '\ntext:' + text);
    log.info('keyPair: ' + JSON.stringify(keyPair));

    notifications.sendAsync({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        endpoint: sub.endpoint,
        auth: sub.auth,
        receiverKey: sub.receiverKey,
        payload: {
            title: 'Enonic XP',
            tag: 'enonic-xp-messages',
            text: text,
            timestamp: new Date(),
            clickUrl: 'https://enonic.com/',
            icon: shieldUrl
        },
        success: function () {
            log.info('Push notification sent');
        },
        error: function (e,a,b,c) {
            log.warning('Push notification failed: ' + e + ' ' + a + ' ' + b + ' ' + c);
        }
    });
}

module.exports = {
    generateKeys: generateKeys,
    notify: notify,
    subscribe: subscribe,
    unsubscribe: unsubscribe
};
