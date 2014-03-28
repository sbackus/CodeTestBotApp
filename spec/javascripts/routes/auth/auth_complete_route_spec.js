//= require spec_helper

describe('AuthCompleteRoute', function () {
    var route;

    beforeEach(function() {
        route = testing().route('auth.complete');
    });

    describe('on beforeModel', function() {
        beforeEach(function() {
            sinon.stub(route, 'transitionTo');
        });

        afterEach(function() {
            route.transitionTo.restore();
        });

        it('authenticates the session with the OutOfBandTokenAuthenticator', function() {
            var queryParams = { token: 'token1234', expires_at: 5000, expires: true };
            var transition = { queryParams: queryParams };

            var fakeSession = { authenticate: sinon.stub() };
            fakeSession.authenticate.returns(Ember.RSVP.resolve());
            route.set('session', fakeSession);

            route.beforeModel(transition);

            expect(fakeSession.authenticate).to.have.been.calledWith('authenticators:out-of-band-token', {
                access_token: queryParams.token,
                expires_at: queryParams.expires_at,
                expires: queryParams.expires
            });
        });

        it('transitions to the previously attempted transition after authentication', function(done) {
            var queryParams = { token: 'token1234', expires_at: 5000, expires: true };
            var transition = { queryParams: queryParams };
            var fakeSession = { authenticate: sinon.stub() };
            fakeSession.authenticate.returns(Ember.RSVP.resolve());
            route.set('session', fakeSession);
            var dataStore = testing().dataStore();
            dataStore.setItem('attemptedTransition', '/test/url');

            route.beforeModel(transition).then(function() {
                try {
                    expect(route.transitionTo).to.have.been.calledWith('/test/url');
                    expect(dataStore.getItem('attemptedTransition')).to.be.null;
                    done();
                } catch (ex) {
                    done(ex);
                }
            }, done);
        });

        it('transitions to the index if there is no previously attempted transition', function(done) {
            var queryParams = { token: 'token1234', expires_at: 5000, expires: true };
            var transition = { queryParams: queryParams };
            var fakeSession = { authenticate: sinon.stub() };
            fakeSession.authenticate.returns(Ember.RSVP.resolve());
            route.set('session', fakeSession);
            var dataStore = testing().dataStore();
            dataStore.removeItem('attemptedTransition');

            route.beforeModel(transition).then(function() {
                try {
                    expect(route.transitionTo).to.have.been.calledWith('/');
                    done();
                } catch (ex) {
                    done(ex);
                }
            }, done);
        });
    });
});