import { startAppEphemeral, resetApp } from '../../helpers/start-app';
import { authenticateSession } from '../../helpers/authentication';
import fakeServer from '../../helpers/fake-server';

describe('Integration - submissions', function() {
    before(function() {
        fakeServer.start();
        startAppEphemeral();
        visit('/').then(authenticateSession);
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
        context('when no assessments', function() {
            before(function() {
                fakeServer.jsonSuccess('GET', 'http://localhost:3000/submissions/1/assessments', { assessments: [] });
            });

            it('shows a no assessments message', function() {
                expect(1);

                visit('/submissions/1');
                andThen(function() {
                    shouldContainText('table.assessments', 'No assessments yet.');
                });
            });
        });

        context('when assessments exist', function() {
            before(function() {
                fakeServer.jsonSuccess('GET', 'http://localhost:3000/submissions/1/assessments', { assessments: [
                    { id: 1, score: 2, notes: 'notes', submission_id: 1, assessor_id: 2 }
                ]});
            });

            it('shows a list of assessments', function() {
                expect(1);

                visit('/submissions/1');
                andThen(function() {
                    expect(find('tr.assessment').length).to.equal(1);
                });
            });
        });
    });
});