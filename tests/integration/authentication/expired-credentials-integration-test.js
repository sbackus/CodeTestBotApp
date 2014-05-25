import { startAppEphemeral, resetApp } from '../../helpers/start-app';
import { authenticateSession } from '../../helpers/authentication';
import fakeServer from '../../helpers/fake-server';

describe('Integration - expired credentials', function() {
    before(function() {
        fakeServer.start();
        fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ 
            session: { id: 1, user_id: 1 }, 
            users: [{id: 1, name: 'User1', role_id: 1}],
            roles: [{id: 1, name: 'Assessor'}]
        })]);
        startAppEphemeral();
    });

    after(function() {
        resetApp();
        fakeServer.stop();
    });

    context('when server responds with invalid_token', function() {
        before(function() {
            fakeServer.respondWith('GET', 'http://localhost:3000/submissions/2', [401, { 'WWW-Authenticate': 'Bearer error="invalid_token"' }, '']);
            visit('/auth/login').then(authenticateSession);
        });

        it('redirects to the login page', function() {
            expect(1);
            console.log('out');
            visit('/submissions/2');
            andThen(function() {
                console.log('out2');
                expect(currentRouteName()).to.equal('auth.login');
            });
        });
    });
});
