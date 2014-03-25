//= require spec_helper

describe('AuthCompletedRoute', function () {
    var route;
    var controller;

    beforeEach(function () {
        controller = { storeToken: sinon.spy() };
        route = testing().route('auth.complete');
        route.transitionTo = sinon.stub();

        localStorage.removeItem('previousTransition');
    });

    it('stores the session token on the application controller', function () {
        var model = { token: '12345' };
        route.setupController(controller, model);

        expect(controller.storeToken).to.have.been.calledWith(model.token);
    });

    it('sets logged in status to true', function () {
        var authController = testing().controller('auth');
        route.setupController(controller, {});
        expect(authController.get('loggedIn')).to.be.true;
    });

    describe('route transition', function () {
        var store;

        beforeEach(function () {
            store = testing().dataStore();
        });

        it('redirects to the previous transition', function () {
            store.getItem = sinon.stub().withArgs('previousTransition').returns('transition test');

            route.setupController(controller, {});

            expect(route.transitionTo).to.have.been.calledWith('transition test');
        });

        it('redirects to / if no previous transition set', function () {
            store.getItem = sinon.stub().withArgs('previousTransition').returns(null);

            route.setupController(controller, {});

            expect(route.transitionTo).to.have.been.calledWith('/');
        });
    });
});