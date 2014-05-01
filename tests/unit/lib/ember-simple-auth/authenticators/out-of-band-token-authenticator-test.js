import { test } from 'ember-qunit';
import 'code-test-bot-app/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator';
module('OutOfBandTokenAuthenticator');

var OutOfBandTokenAuthenticator = Ember.SimpleAuth.Authenticators.OutOfBandTokenAuthenticator;

test('restore: returns a promise that rejects if the access_token is empty', function() {
    expect(2);

    var badData1 = { };
    var badData2 = { access_token: '' };
    var authenticator = OutOfBandTokenAuthenticator.create();

    Ember.run(function() {
        authenticator.restore(badData1).then(null, function() {
            ok(true);
        });
        authenticator.restore(badData2).then(null, function() {
            ok(true);
        });
    });
});

test('restore: returns a promise that rejects if the access token is expired', function() {
    expect(1);

    var now = (new Date()).getTime();
    var expiredToken = { access_token: 'token', expires_at: now - 100 };
    var authenticator = OutOfBandTokenAuthenticator.create();

    Ember.run(function() {
        authenticator.restore(expiredToken).then(null, function() {
            ok(true);
        });
    });
});

test('restore: returns a promise that resolves if the access token exists and is not expired', function() {
    var now = (new Date()).getTime();
    var goodToken = { access_token: 'token', expires_at: now + 100 };
    var authenticator = OutOfBandTokenAuthenticator.create();

    Ember.run(function() {
        authenticator.restore(goodToken).then(function(result) {
            deepEqual(result, goodToken);
        }, null);
    });
});

test('authenticate: returns a promise that resolves with the expires_at value normalized to milliseconds', function() {
    var token = { access_token: 'token', expires_at: 5, expires: 'true' };
    var authenticator = OutOfBandTokenAuthenticator.create();

    Ember.run(function() {
        authenticator.authenticate(token).then(function(result) {
            deepEqual(result, { access_token: 'token', expires_at: 5000, expires: true });
        });
    });
});