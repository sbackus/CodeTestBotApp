/* globals sinon, equal */

import { test, moduleFor } from 'ember-qunit';

moduleFor('route:submissions/index', 'Submissions Index Route');

test('model is a list of submissions', function() {
    var expectedSubmissions = 'expectedSubmissions';

    var route = this.subject();
    var store = { find: function() {} };
    route.store = store;
    sinon.stub(store, 'find').withArgs('submission').returns(expectedSubmissions);

    Ember.run(function() {
        var model = route.model();

        equal(model, expectedSubmissions);
    });
});