import { startAppEphemeral, resetApp } from '../../helpers/start-app';
import { authenticateSession } from '../../helpers/authentication';
import fakeServer from '../../helpers/fake-server';

describe('Integration - submissions', function() {
    before(function() {
        fakeServer.start();
        startAppEphemeral();
        fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ 
            session: { id: 1, user_id: 1 }, 
            users: [{id: 1, name: 'User1', role_id: 1}],
            roles: [{id: 1, name: 'Assessor'}]
        })]);
        visit('/auth/login').then(authenticateSession);
    });

    after(function() {
        resetApp();
        fakeServer.stop();
    });

    describe('new route', function() {
        before(function() { visit('/submissions/new'); });

        context('when leaving route with unsaved submission', function() {
            before(function() {
                fakeServer.jsonSuccess('GET', 'http://localhost:3000/submissions', { submissions: [] });
                visit('/submissions');
            });

            it('deletes the unsaved record', function() {
                expect(1);

                andThen(function() {
                    expect(find('tr.submission').length).to.equal(0);
                });
            });
        });
    });

    describe('detail page', function() {
        context('when user has not submitted an assessment', function() {
            before(function() {
                fakeServer.jsonSuccess('GET', 'http://localhost:3000/assessments?submission_id=1', { assessments: [
                    { id: 2, score: 4, notes: 'notes', submission_id: 1, assessor_id: 3 }
                ]});
            });

            it('shows a no assessments message', function() {
                expect(1);

                visit('/submissions/1');
                andThen(function() {
                    shouldContainText('table.assessments', 'All assessments will be visible');
                });
            });
        });

        context('when assessments exist', function() {
            before(function() {
                fakeServer.jsonSuccess('GET', 'http://localhost:3000/assessments?submission_id=1', { assessments: [
                    { id: 1, score: 2, notes: 'notes', submission_id: 1, assessor_id: 2, published: true },
                    { id: 2, score: 4, notes: 'notes', submission_id: 1, assessor_id: 3, published: true }
                ]});
            });

            /*
            it('shows a list of assessments', function() {
                expect(1);

                visit('/submissions/1');
                andThen(function() {
                    expect(find('tr.assessment').length).to.equal(2);
                });
            });
            */

            it('shows an average score', function() {
                expect(1);

                visit('/submissions/1');
                andThen(function() {
                    expect(find('p.score').text()).to.equal('3');
                });
            });
        });
    });
});
