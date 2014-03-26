//= require spec_helper

describe('AuthLogoutRoute', function () {
    var route;
    var authController;
    beforeEach(function () {
        route = testing().route('auth.logout');
        authController = testing().controller('auth');
        sinon.stub(authController, 'logout');
    });

    afterEach(function () {
        authController.logout.restore();
    });

    it('calls logout on the auth controller', function () {
        route.setupController();

        expect(authController.logout).to.have.been.called;
    });

    it('redirects to /', function () {
        sinon.stub(route,'transitionTo');
        route.setupController();
        expect(route.transitionTo).to.have.been.calledWith('/');
        route.transitionTo.restore();
    })
});
