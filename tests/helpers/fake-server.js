
var __server__;

function start() {
    __server__ = sinon.fakeServer.create();
    __server__.autoRespond = true;
    __server__.respondWith(function(request) {
        console.error('Unhandled request ' + request.method + ' ' + request.url);
        request.respond([404, {}, '']);
    });
}

function stop() {
    __server__.restore();
}

function respondWith(method, url, response) {
    __server__.respondWith(method, url, response);
}

function jsonSuccess(method, url, response) {
    respondWith(method, url, [200, { 'Content-Type': 'application/json' }, JSON.stringify(response)]);
}

export default {
    start: start,
    stop: stop,
    respondWith: respondWith,
    jsonSuccess: jsonSuccess
};
