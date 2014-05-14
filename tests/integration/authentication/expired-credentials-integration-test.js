import { startAppEphemeral, resetApp } from '../../helpers/start-app';
import { authenticateSession } from '../../helpers/authentication';
import fakeServer from '../../helpers/fake-server';

describe('Integration - expired credentials', function() {
    before(function() {
        fakeServer.start();
        startAppEphemeral();
    });

    after(function() {
        resetApp();
        fakeServer.stop();
    });

    context('when server responds with invalid_token', function() {
        before(function() {
            fakeServer.respondWith('GET', 'http://localhost:3000/submissions/2', [401, { 'WWW-Authenticate': 'Bearer error="invalid_token"' }, '']);
            visit('/auth/login');
            andThen(authenticateSession);
        });

        it('redirects to the login page', function() {
            visit('/submissions/2');
            andThen(function() {
                expect(currentRouteName()).to.equal('auth.login');
            });
        });
    });
});