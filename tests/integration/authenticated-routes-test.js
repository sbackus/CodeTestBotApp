import { test , moduleFor } from 'ember-qunit';
import { startAppEphemeral, resetApp } from '../helpers/start-app';
import { authenticateSession } from '../helpers/authentication';
import fakeServer from '../helpers/fake-server';

module('Authenticated Route', {
    setup: function() {
        fakeServer.start();
        fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ session: { id: 1, user_id: 2 }, users: [{id: 2, name: 'User2'}]})]);
        startAppEphemeral();
    },
    teardown: function() {
        resetApp();
        fakeServer.stop();
    }
});

test('when session not authenticated, saves transition intent and transitions to login', function() {
    expect(2);

    var store = CodeTestBotApp.get('dataStore');

    visit('/submissions/new');
    andThen(function() {
        equal(store.getItem('attemptedTransition'), '/submissions/new');
        equal(currentRouteName(), 'auth.login');
    });
});

test('when session is authenticated, continues transition like normal', function() {
    expect(1);

    visit('/auth/login').then(authenticateSession);

    visit('/submissions/new');
    andThen(function() {
        equal(currentRouteName(), 'submissions.new');
    });
});