//= require spec_helper

describe('AuthLoginRoute', function() {
    var route;

    beforeEach(function() {
        route = testing().route('auth.login');
    });

    describe('model', function() {
        it('queries the new session URI to get the auth_uri', function(done) {
            var expectedResponse = {auth_uri: 'testing_uri'};
            fakeServer.respondWith('GET', CONFIG.NEW_SESSION_URL + '?redirect_uri=' + CONFIG.APP_HOST + '/auth/complete',
                [200, {'Content-Type': 'application/json'}, JSON.stringify(expectedResponse)]);

            route.model().then(function(result) {
                try {
                    expect(result).to.deep.equal(expectedResponse);
                    done();
                } catch (ex) {
                    done(ex);
                }
            }, done);
        });
    });
});
