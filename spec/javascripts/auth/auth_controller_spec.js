//= require spec_helper

describe('AuthController', function () {
    var authController, dataStore;

    beforeEach(function () {
        authController = testing().controller('auth');
        dataStore = testing().dataStore();
    });

    describe('login', function () {
        it('sets loggedIn to true', function () {
            authController.set('loggedIn', false);

            authController.login(null);

            expect(authController.get('loggedIn')).to.be.true;
        });

        it('stores the sessionToken in the application dataStore', function () {
            sinon.spy(dataStore, 'setItem');

            authController.login('testing123');

            expect(dataStore.setItem).to.have.been.calledWith('sessionToken', 'testing123');
        });
    });

    describe('logout', function () {
        it('sets loggedIn to false', function () {
            authController.set('loggedIn', true);

            authController.logout();

            expect(authController.get('loggedIn')).to.be.false;
        });

        it('removes the session token from store', function () {
            sinon.spy(dataStore, 'removeItem');

            authController.logout();

            expect(dataStore.removeItem).to.be.calledWith('sessionToken');
        });

        it('sends a delete request with the token to the server', function () {
            sinon.stub(dataStore, 'getItem').withArgs('sessionToken').returns('testing123');

            authController.logout();

            expect(mostRecentRequest().method).to.equal('DELETE');
            expect(mostRecentRequest().requestBody).to.equal('token=testing123');

            dataStore.getItem.restore();
        });
    });

    describe('handleAuthResponse', function() {
        describe('on result success', function() {
            it('logs in with the token via the login method', function() {
                var response = { result: 'success', token: CodeTestBotApp.ApiSessionToken.create({ token: 'testing123' }) };
                sinon.stub(authController, 'login');

                authController.handleAuthResponse(response);

                expect(authController.login).to.have.been.calledWith('testing123');
                authController.login.restore();
            });
        });

        describe('on result auth_required', function() {
            it('aborts the given transition', function() {
                var transition = { abort: sinon.stub() };

                authController.handleAuthResponse({ result: 'auth_required' }, false, transition);

                expect(transition.abort).to.have.been.called;
            });

            it('transitions to the login route if redirect argument is false', function() {
                sinon.stub(authController, 'transitionToRoute');

                authController.handleAuthResponse({ result: 'auth_required' }, false, null);

                expect(authController.transitionToRoute).to.have.been.calledWith('auth.login');
                authController.transitionToRoute.restore();
            });

            it('redirects to the auth_url if redirect argument is true', function() {
                authController.handleAuthResponse({ result: 'auth_required', auth_url: '/test/auth' }, true, null);

                expect(WindowLocationHelper.setLocation).to.have.been.calledWith('/test/auth');
            });
        });
    });
});
