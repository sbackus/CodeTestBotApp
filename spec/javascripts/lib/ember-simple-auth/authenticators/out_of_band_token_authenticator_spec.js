//= require spec_helper

describe('OutOfBandTokenAuthenticator', function() {
    var authenticator;

    beforeEach(function() {
        authenticator = Ember.SimpleAuth.Authenticators.OutOfBandTokenAuthenticator.create();
    });

    describe('restore', function() {
        it('returns a promise that rejects if the access_token is empty', function() {
            var badData1 = { };
            var badData2 = { access_token: '' };

            expect(authenticator.restore(badData1)).to.eventually.be.rejected;
            expect(authenticator.restore(badData2)).to.eventually.be.rejected;
        });

        it('returns a promise the rejects if the access token is expired', function() {
            var now = (new Date()).getTime();
            var expired_token = { access_token: 'token', expires_at: now - 100 };

            expect(authenticator.restore(expired_token)).to.eventually.be.rejected;
        });

        it('returns a promise that resolves if the access token exists and is not expired', function() {
            var now = (new Date()).getTime();
            var good_token = { access_token: 'token', expires_at: now + 100 };

            expect(authenticator.restore(good_token)).to.eventually.deep.equal(good_token);
        });
    });

    describe('authenticate', function() {
        it('returns a promise that resolves with the expires_at value normalized to milliseconds', function() {
            var token = { access_token: 'token', expires_at: 5 };

            expect(authenticator.authenticate(token)).to.eventually.deep.equal({ access_token: 'token', expires_at: 5000 });
        });
    });
});
