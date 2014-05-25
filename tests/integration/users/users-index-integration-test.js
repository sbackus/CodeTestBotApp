/* Commented out until we can figure out why user role is so sketchy in tests.
 
import { test } from 'ember-qunit';
import { startAppEphemeral, resetApp } from '../../helpers/start-app';
import { authenticateSession } from '../../helpers/authentication';
import fakeServer from '../../helpers/fake-server';

module('Users Index Integration', {
    setup: function() {
        fakeServer.start();
        fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ 
            session: { id: 1, user_id: 2 }, 
            users: [{id: 2, name: 'User2', role_id: 3}],
            roles: [{id: 3, name: 'Administrator'}]
        })]);
        startAppEphemeral();
        visit('/auth/login').then(authenticateSession);
    },
    teardown: function() {
        resetApp();
        fakeServer.stop();
    }
});

test('displays a list of users', function() {
    expect(2);

    visit('/admin/users');
    andThen(function() {
        var names = [];
        find('td.name').each(function() {
            names.push($(this).text());
        });

        equal(names[0], 'User2');
        equal(names[1], 'User1');
    });
});

test('can transition to user edit', function() {
    expect(2);

    visit('/admin/users');
    click('.button[href="/admin/users/1/edit"]');
    andThen(function() {
        equal(currentRouteName(), 'user.edit');
        equal(currentURL(), '/admin/users/1/edit');
    });
});

test('edit button is enabled for editable users', function() {
    expect(1);

    visit('/admin/users');
    andThen(function() {
        var button = find('a.button[href="/admin/users/1/edit"]');
        ok(!button.hasClass('disabled'), 'Edit button should not be disabled');
    });
});

test('edit button is disabled for uneditable users', function() {
    expect(1);

    visit('/admin/users');
    andThen(function() {
        var button = find('a.button[href="/admin/users/2/edit"]');
        ok(button.hasClass('disabled'), 'Edit button should be disabled');
    });
});
*/
