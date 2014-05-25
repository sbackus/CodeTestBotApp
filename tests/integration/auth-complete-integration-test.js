import { test } from 'ember-qunit';
import { startAppEphemeral, resetApp } from '../helpers/start-app';
import { getSession } from '../helpers/authentication';
import fakeServer from '../helpers/fake-server';

module('Auth Complete Integration', {
    setup: function() {
        fakeServer.start();
        fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ 
            session: { id: 1, user_id: 1 }, 
            users: [{id: 1, name: 'User1', role_id: 1}],
            roles: [{id: 1, name: 'Assessor'}]
        })]);
        startAppEphemeral();
    },
    teardown: function() {
        resetApp();
        fakeServer.stop();
    }
});

var url = '/auth/complete?token=token1234&expires_at=5000&expires=true';

test('authenticates the session with the OutOfBandTokenAuthenticator', function() {
    expect(3);

    visit(url);
    andThen(function() {
        var session = getSession();
        equal(session.get('access_token'), 'token1234');
        equal(session.get('expires_at'), 5000000);
        equal(session.get('expires'), true);
    });
});

test('transitions to the previously attempted transition after authentication', function() {
    expect(1);

    var store = CodeTestBotApp.get('dataStore');
    store.setItem('attemptedTransition', '/submissions/new');

    visit(url);
    andThen(function() {
        equal(currentURL(), '/submissions/new');
    });
});
