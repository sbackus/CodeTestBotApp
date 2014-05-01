// TODO: figure out why JSHint is not using .jshintrc only for some tests (like this one, requiring this annoying globals line)
/* globals CodeTestBotApp, expect, visit, andThen, equal, currentRouteName */

import { test , moduleFor } from 'ember-qunit';
import startApp from '../helpers/start-app';

moduleFor('route:submissions/new', 'Authenticated Route', {
    setup: function() {
        window.CodeTestBotApp = startApp({ storeFactory: 'session-store:ephemeral' });
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

    var session = CodeTestBotApp.__container__.lookup('session:main');
    session.authenticate('authenticator:out-of-band-token', {
        access_token: 'fake_token',
        expires_at: (new Date().getTime() / 1000) + 86400,
        expires: true
    });

    visit('/submissions/new');
    andThen(function() {
        equal(currentRouteName(), 'submissions.new');
    });
});