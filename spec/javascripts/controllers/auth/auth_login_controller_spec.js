//= require spec_helper

describe('AuthLoginController', function() {
    var controller;

    beforeEach(function() {
        controller = testing().controller('auth.login');
        CodeTestBotApp.reset();
    });

    describe('login action', function() {
        it('redirects to the auth_uri from the model', function() {
            fakeServer.respondWith('GET', CONFIG.NEW_SESSION_URL + '?redirect_uri=' + CONFIG.APP_HOST + '/auth/complete',
                [200, {'Content-Type': 'application/json'}, JSON.stringify({ auth_uri: 'testing_uri'})]);

            visit('/auth/login');
            click('button#login').then(function() {
                expect(WindowLocationHelper.setLocation).to.have.been.calledWith('testing_uri');
            });
        });
    });
});