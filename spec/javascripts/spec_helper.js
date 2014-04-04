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
    SESSIONS_URL: 'test_server/sessions',
    NEW_SESSION_URL: 'test_server/sessions/new'
};

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
        randomElement: function(arr) {
            return arr[Math.floor(Math.random()*arr.length)];
        }
    };

    return helper;
}

beforeEach(function() {
    window.fakeServer = sinon.fakeServer.create();
    fakeServer.autoRespond = true;
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