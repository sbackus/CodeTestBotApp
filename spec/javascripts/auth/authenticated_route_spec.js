//= require spec_helper

describe('AuthenticatedRoute', function() {
    var route;
    var response = {};
    var promise;
    var authController;

    beforeEach(function() {
        route = testing().route('submissions.new'); // an AuthenticatedRoute
        promise = new Promise(function(resolve, reject) { resolve(response); })
        authController = testing().controller('auth');

        sinon.stub(CodeTestBotApp.ApiSessionToken, 'acquire').returns(promise);
        sinon.stub(authController, 'handleAuthResponse');
    });

    afterEach(function() {
        CodeTestBotApp.ApiSessionToken.acquire.restore();
        authController.handleAuthResponse.restore();
    });

    describe('not logged in', function() {
        beforeEach(function() {
            authController.set('loggedIn', false);
        });

        it('tries to acquire a session token to start auth process', function(done) {
            route.beforeModel({ intent: { url: '' } }).then(function() {
                expect(authController.handleAuthResponse).to.have.been.calledWith(response, false);
                done();
            }, done);
        });

        it('stores the current transition in the application dataStore', function(done) {
            var dataStore = testing().dataStore();
            sinon.stub(dataStore, 'setItem');
            var transitionUrl = '/test/url';

            route.beforeModel({ intent: { url: transitionUrl } }).then(function() {
                expect(dataStore.setItem).to.have.been.calledWith('previousTransition', transitionUrl);
                done();
            }, done);
        });
    });

    describe('logged in', function() {
        beforeEach(function() {
            authController.set('loggedIn', true);
        });

        it('does not try to acquire a session token', function() {
            route.beforeModel({ intent: { url: '' } });
            expect(authController.handleAuthResponse).not.to.have.been.called;
        });
    });

});
