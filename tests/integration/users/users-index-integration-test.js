import { test } from 'ember-qunit';
import { startAppEphemeral, resetApp } from '../../helpers/start-app';
import { authenticateSession } from '../../helpers/authentication';

module('Users Index Integration', {
    setup: function() {
        startAppEphemeral();
        authenticateSession();
    },
    teardown: function() {
        resetApp();
    }
});

test('displays a list of users', function() {
    expect(1);

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
    expect(2);

    visit('/users');
    click('.button[href="/users/1/edit"]');
    andThen(function() {
        equal(currentRouteName(), 'user.edit');
        equal(currentURL(), '/users/1/edit');
    });
});

test('edit button is enabled for editable users', function() {
    expect(1);

    visit('/users');
    andThen(function() {
        var button = find('a.button[href="/users/1/edit"]');
        ok(!button.hasClass('disabled'), 'Edit button should not be disabled');
    });
});

test('edit button is disabled for uneditable users', function() {
    expect(1);

    visit('/users');
    andThen(function() {
        var button = find('a.button[href="/users/2/edit"]');
        ok(button.hasClass('disabled'), 'Edit button should be disabled');
    });
});
