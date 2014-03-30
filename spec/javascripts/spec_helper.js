//= require support/chai
//= require support/sinon
//= require support/sinon-chai
//= require support/chai-as-promised

//
// PhantomJS (Teaspoons default driver) doesn't have support for Function.prototype.bind, which has caused confusion. Use
// this polyfill to avoid the confusion.
//= require support/bind-poly

//= require application
//= require support/ember-mocha-adapter

window.expect = chai.expect;

window.CONFIG = {
    APP_HOST: 'http://fake.app.host',
    SERVER_HOST: 'http://fake.server.host',
    SESSIONS_URL: 'test_server/sessions',
    NEW_SESSION_URL: 'test_server/sessions/new'
};

CodeTestBotApp.setupForTesting();
CodeTestBotApp.injectTestHelpers();

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

function mostRecentRequest() {
    return fakeServer.requests[fakeServer.requests.length - 1];
}

sinon.stub(WindowLocationHelper, 'setLocation');