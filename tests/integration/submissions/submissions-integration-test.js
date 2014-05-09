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

    it('models', function() {
        expect(1);

        fakeServer.jsonSuccess('GET', 'http://localhost:3000/submissions', { submissions: [] });

        visit('/submissions/new');
        visit('/submissions');
        andThen(function() {
            expect(find('tr.submission').length).to.equal(0);
        });
    });
});