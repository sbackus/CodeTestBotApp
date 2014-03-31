//= require spec_helper

describe('AuthenticatedRoute', function() {
    var route;

    beforeEach(function() {
        route = testing().route('submissions.new'); // an AuthenticatedRoute
        sinon.stub(route, 'transitionTo');
    });

    afterEach(function() {
        route.transitionTo.restore();
    });

    describe('on beforeModel', function() {
        var transition;

        beforeEach(function() {
            transition = { intent: { url: '/some/url' }, abort: sinon.stub(), send: sinon.stub() }
        });

        describe('when session is not authenticated', function() {
            beforeEach(function() {
                route.set('session', { isAuthenticated: false });
            });

            it('saves the transition intent in the application store', function() {
                var dataStore = testing().dataStore();
                sinon.stub(dataStore, 'setItem');

                route.beforeModel(transition);

                expect(dataStore.setItem).to.have.been.calledWith('attemptedTransition', '/some/url');

                dataStore.setItem.restore();
            });

            it('transitions to the login route', function() {
                route.beforeModel(transition);

                expect(transition.abort).to.have.been.called;
                expect(transition.send).to.have.been.calledWith('authenticateSession');
            });
        });

        describe('when session is authenticated', function() {
            beforeEach(function() {
                route.set('session', { isAuthenticated: true });
            });

            it('continues transition like normal', function() {
                route.beforeModel(transition);

                expect(transition.abort).not.to.have.been.called;
                expect(transition.send).not.to.have.been.called;
            });
        });
    });
});
