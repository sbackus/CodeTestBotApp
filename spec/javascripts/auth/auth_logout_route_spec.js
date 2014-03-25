//= require spec_helper

describe('AuthLogoutRoute', function () {
    var route;
    var authController;
    beforeEach(function () {
        route = testing().route('auth.logout');
        authController = testing().controller('auth');
    });

    it('calls logout on the auth controller', function () {
        sinon.spy(authController, 'logout');

        route.setupController();

        expect(authController.logout).to.have.been.called;
    });

    it('redirects to /', function () {
        sinon.spy(route,'transitionTo');
        route.setupController();
        expect(route.transitionTo).to.have.been.calledWith('/');
    })
});
