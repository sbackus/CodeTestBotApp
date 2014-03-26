//= require spec_helper

describe('AuthLoginController', function() {
    var controller;

    beforeEach(function() {
        controller = testing().controller('auth.login');
        CodeTestBotApp.reset();
    });

    describe('login action', function() {
        it('tries to acquire a session token and hands off the response to the auth controller', function() {
            var response = {};
            var promise = new Promise(function(resolve, reject) { resolve(response); });
            var authController = testing().controller('auth');
            sinon.stub(CodeTestBotApp.ApiSessionToken, 'acquire').returns(promise);
            sinon.stub(authController, 'handleAuthResponse');

            visit('/auth/login');
            click('button#login').then(function() {
                expect(authController.handleAuthResponse).to.have.been.calledWith(response, true);
                CodeTestBotApp.ApiSessionToken.acquire.restore();
            });
        });
    });
});