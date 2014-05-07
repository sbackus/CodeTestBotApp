import { test } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import { authenticateSession } from '../../helpers/authentication';
import { defineServerFixture } from '../../fixtures';
import fakeServer from '../../helpers/fake-server';

var server;
module('Assessments New Integration', {
    setup: function() {
        window.CodeTestBotApp = startApp({ storeFactory: 'session-store:ephemeral', dataStore: 'data-store:ephemeral' });

        fakeServer.start();
        fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ session: { id: 1, user_id: 2 }, users: [{id: 2, name: 'User2'}]})]);

        visit('/').then(authenticateSession);
    },
    teardown: function() {
        CodeTestBotApp.reset();
        fakeServer.stop();
    }
});

test('displays a form to create an assessment', function() {
    expect(4);

    visit('/submissions/1/assessments/new');
    andThen(function() {
        equal(find('select.language').val(), 1);
        equal(find('select.level').val(), 1);
        equal(find('textarea.email-text').val(), 'some text');
        equal(find('a.zipfile').attr('href'), 'url to file');
    });
});

test('saves the assessment and redirects to the submission details page', function() {
    expect(1);

    fakeServer.jsonSuccess('POST', 'http://localhost:3000/assessments', {});

    visit('/submissions/1/assessments/new');
    fillIn('input.score', '1');
    fillIn('textarea.notes', 'notes');
    click('button.create');
    andThen(function() {
        equal(currentURL(), '/submissions/1');
    });
});
