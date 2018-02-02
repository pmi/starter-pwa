var portalLib = require('/lib/xp/portal');

var getAppUrl = exports.getAppUrl = function getAppUrl() {
    return portalLib.url({path:'/app/' + app.name});
};

var getBaseUrl = exports.getBaseUrl = function() {
    var appUrl = getAppUrl();
    var baseUrl = endsWithSlash(appUrl) ? appUrl.slice(0, -1) : appUrl;
    
    return baseUrl;
};

exports.getPrecacheUrl = function() {
    return getBaseUrl() + '/precache';
};

var endsWithSlash = exports.endsWithSlash = function(url) {
    return url.slice(-1) === '/';
};
