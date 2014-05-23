import { startAppEphemeral, resetApp } from '../../helpers/start-app';
import { authenticateSession } from '../../helpers/authentication';
import fakeServer from '../../helpers/fake-server';

describe('Integration - edit assessment', function() {
    before(function() {
        fakeServer.start();
        startAppEphemeral();
        fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ session: { id: 1, user_id: 2 }, users: [{id: 2, name: 'User2'}]})]);
        visit('/auth/login').then(authenticateSession);
    });

    after(function() {
        resetApp();
        fakeServer.stop();
    });

    describe('detail page', function() {

        context('when assessments exist', function() {
            before(function() {
                fakeServer.jsonSuccess('GET', 'http://localhost:3000/assessments/1', {
                    "submissions":[{"id":1,"email_text":"submission", "zipfile":"foo.zip","active":true,"language_id":1,"candidate_id":1}],
                    "languages":[{"id":1,"name":"Java"}],
                    "candidates":[{"id":1,"name":"The Dude","email":"dude@dude.com","level_id":3}],
                    "levels":[{"id":3,"text":"Senior"}],
                    "assessors":[{"id":1,"name":"An Assessor","email":"anassessor@cyrusinnovation.com"}],
                    "assessment":{"id":1,"score":1,"notes":"awful", "submission_id":1,"assessor_id":1}});
                fakeServer.jsonSuccess('PUT', 'http://localhost:3000/assessments/1', {});
            });

            it('shows data from the existing assessment', function() {
               expect(2);

                visit('/assessments/1/edit');
                andThen(function() {
                    equal(find('textarea.notes').val(), 'awful');
                    equal(find('input.score').val(), '1');
                });
            });

            it('allows you to edit and save the existing assessment', function() {
                expect(0)
                visit('/assessments/1/edit');
                andThen(function() {
                    fillIn('input.score', '3');
                    fillIn('textarea.notes', 'mediocre not bad');
                    click('button.create');

                });
            });


        });
    });
});
