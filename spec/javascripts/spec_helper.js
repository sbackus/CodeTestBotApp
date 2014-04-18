//= require support/chai
//= require support/sinon
//= require support/sinon-chai
//= require support/chai-as-promised

//
// PhantomJS (Teaspoons default driver) doesn't have support for Function.prototype.bind, which has caused confusion. Use
// this polyfill to avoid the confusion.
//= require support/bind-poly

//= require testing
//= require application
//= require support/ember-mocha-adapter

window.expect = chai.expect;

window.CONFIG = {
    APP_HOST: 'http://fake.app.host',
    SERVER_HOST: 'http://fake.server.host',
    SESSIONS_URL: 'http://fake.server.host/sessions',
    NEW_SESSION_URL: 'http://fake.server.host/sessions/new'
};

// Recreate adapter so that it picks up the testing config values
CodeTestBotApp.ApplicationAdapter = DS.ActiveModelAdapter.extend({
    host: CONFIG.SERVER_HOST
});

function testing() {
    var helper = {
        container: function() {
            return CodeTestBotApp.__container__;
        },
        dataStore: function() {
            return CodeTestBotApp.get('dataStore');
        },
        controller: function(name) {
            return helper.container().lookup('controller:' + name);
        },
        route: function(name) {
            return helper.container().lookup('route:' + name);
        },
        store: function() {
            return helper.container().lookup('store:main');
        },
        randomElement: function(arr) {
            return arr[Math.floor(Math.random()*arr.length)];
        },
        callAction: function(controller, actionName){
            return controller._actions[actionName].apply(controller);
        },
        mockAjaxResponse: function(method, path, response, code) {
            fakeServer.respondWith(method, CONFIG.SERVER_HOST + path,
                [code || 200, { 'Content-Type': 'application/json' }, JSON.stringify(response)]);
        },
        promiseErrorHandler: function(done) {
            return function(err) {
                console.log(err);
                done(err);
            };
        }
    };

    return helper;
}

beforeEach(function() {
    window.fakeServer = sinon.fakeServer.create();
    fakeServer.autoRespond = true;
    fakeServer.respondWith(function(request) {
        console.error('Unhandled request: ', request);
        request.respond(404, [], '');
    });
});

afterEach(function() {
    fakeServer.restore();
});

after(function() {
    // Cheesy hacks to reset the browser URL and clean up the page HTML after test runs so that you can
    // refresh to re-run tests.
    CodeTestBotApp.Router.map(function() {
        this.route('_test_hack', { path: '/teaspoon/default' })
    });
    visit('/teaspoon/default');
    $('.ember-view').remove();
});

function mostRecentRequest() {
    return fakeServer.requests[fakeServer.requests.length - 1];
}

sinon.stub(WindowLocationHelper, 'setLocation');