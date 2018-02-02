var mustacheLib = require('/lib/xp/mustache');
var router = require('/lib/router')();
var helper = require('/lib/helper');
var swController = require('/lib/pwa/sw-controller');
var pushController = require('push');
var portalLib = require('/lib/xp/portal');
var siteTitle = 'PWA Starter';

var publicKey = pushController.generateKeys().publicKey;

var renderPage = function (pageName) {
    return function () {
        return {
            body: mustacheLib.render(resolve('pages/' + pageName), {
                title: siteTitle,
                version: app.version,
                publicKey: publicKey,
                pageUrl: portalLib.pageUrl({}),
                baseUrl: helper.getBaseUrl(),
                precacheUrl: helper.getPrecacheUrl(),
                themeColor: '#FFF',
                styles: mustacheLib.render(resolve('/pages/styles.html')),
                serviceWorker: mustacheLib.render(resolve('/pages/sw.html'), {
                    title: siteTitle,
                    baseUrl: helper.getBaseUrl(),
                    precacheUrl: helper.getBaseUrl() + '/precache',
                    appUrl: helper.getAppUrl()
                })
            })
        };
    }
};

router.get('/', renderPage('main.html'));

router.get('/push', renderPage('push.html'));

router.post('push/notify', function (req) {
    pushController.notify(req.params.text);
});
router.post('push/subscribe', function (req) {
    pushController.subscribe(req);
});
router.post('push/unsubscribe', function (req) {
    pushController.unsubscribe(req);
})

router.get('/about', renderPage('about.html'));

router.get('/contact', renderPage('contact.html'));

router.get('/sw.js', swController.get);

exports.get = function (req) {
    return router.dispatch(req);
};
exports.post = function (req) {
    return router.dispatch(req);
};
