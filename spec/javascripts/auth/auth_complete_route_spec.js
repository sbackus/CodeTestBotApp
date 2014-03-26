//= require spec_helper

describe('AuthCompletedRoute', function () {
    var route;
    beforeEach(function () {
        route = testing().route('auth.complete');
        sinon.stub(route, 'transitionTo');

        localStorage.removeItem('previousTransition');
    });

    afterEach(function() {
        route.transitionTo.restore();
    });

    it('logs in with the sessionToken via the authController', function () {
        var model = { token: '12345' };
        var authController = testing().controller('auth');
        sinon.spy(authController, 'login');

        route.setupController(null, model);

        expect(authController.login).to.have.been.calledWith(model.token);
    });

    describe('route transition', function () {
        var store;

        beforeEach(function () {
            store = testing().dataStore();
            sinon.stub(store, 'getItem');
        });

        afterEach(function() {
            store.getItem.restore();
        });

        it('redirects to the previous transition', function () {
            store.getItem.withArgs('previousTransition').returns('transition test');

            route.setupController(null, {});

            expect(route.transitionTo).to.have.been.calledWith('transition test');
        });

        it('redirects to / if no previous transition set', function () {
            store.getItem.withArgs('previousTransition').returns(null);

            route.setupController(null, {});

            expect(route.transitionTo).to.have.been.calledWith('/');
        });
    });
});