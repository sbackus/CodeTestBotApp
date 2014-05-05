import { test , moduleFor } from 'ember-qunit';
import startApp from '../helpers/start-app';
import { authenticateSession } from '../helpers/authentication';

module('Authenticated Route', {
    setup: function() {
        window.CodeTestBotApp = startApp({ storeFactory: 'session-store:ephemeral', dataStore: 'data-store:ephemeral' });
    },
    teardown: function() {
        CodeTestBotApp.reset();
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

    visit('/').then(authenticateSession);

    visit('/submissions/new');
    andThen(function() {
        equal(currentRouteName(), 'submissions.new');
    });
});