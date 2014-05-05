import { test } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import { authenticateSession } from '../../helpers/authentication';

module('Assessments New Integration', {
    setup: function() {
        window.CodeTestBotApp = startApp({ storeFactory: 'session-store:ephemeral', dataStore: 'data-store:ephemeral' });
        visit('/').then(authenticateSession);
    },
    teardown: function() {
        CodeTestBotApp.reset();
    }
});

test('visit', function() {
    expect(4);

    visit('/submissions/1/assessments/new');
    andThen(function() {
        equal(find('select.language').val(), 1);
        equal(find('select.level').val(), 1);
        equal(find('textarea.email-text').val(), 'some text');
        equal(find('a.zipfile').attr('href'), 'url to file');
    });
});
