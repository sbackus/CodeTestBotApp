/* globals visit, andThen, find, click, currentRouteName, currentURL, ok, equal, deepEqual */

import { test } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import { authenticateSession } from '../../helpers/authentication';

module('Users Index Integration', {
    setup: function() {
        window.CodeTestBotApp = startApp({ storeFactory: 'session-store:ephemeral' });
        authenticateSession();
    },
    teardown: function() {
        CodeTestBotApp.reset();
    }
});

test('displays a list of users', function() {
    visit('/users');
    andThen(function() {
        var names = [];
        find('td.name').each(function() {
            names.push($(this).text());
        });

        deepEqual(names, ['User1', 'User2']);
    });
});

test('can transition to user edit', function() {
    visit('/users');
    click('.button[href="/users/1/edit"]');
    andThen(function() {
        equal(currentRouteName(), 'user.edit');
        equal(currentURL(), '/users/1/edit');
    });
});

test('edit button is enabled for editable users', function() {
    visit('/users');
    andThen(function() {
        var button = find('a.button[href="/users/1/edit"]');
        ok(!button.hasClass('disabled'), 'Edit button should not be disabled');
    });
});

test('edit button is disabled for uneditable users', function() {
    visit('/users');
    andThen(function() {
        var button = find('a.button[href="/users/2/edit"]');
        ok(button.hasClass('disabled'), 'Edit button should be disabled');
    });
});
