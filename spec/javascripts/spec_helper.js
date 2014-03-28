//= require application
//= require ember-mocha-adapter
//= require sinon
//= require sinon-chai
//= require chai-as-promised

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