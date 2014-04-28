/* globals deepEqual */

import { test, moduleFor } from 'ember-qunit';

moduleFor('route:auth/login', 'Auth Login Route');

test('model queries the new session URI for the auth_uri', function() {
    var route = this.subject();

    var expected = {auth_uri: 'testing_uri'};

    Ember.run(function() {
        route.model().then(function(result) {
            deepEqual(result, expected);
        });
    });
});
