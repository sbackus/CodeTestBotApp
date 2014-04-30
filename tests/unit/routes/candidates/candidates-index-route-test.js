/* globals sinon, equal */

import { moduleFor, test } from 'ember-qunit';

moduleFor('route:candidates/index', 'Candidates Index Route');

test('model is a list of candidates', function() {
    var expectedCandidates = 'expectedCandidates';

    var route = this.subject();
    var store = { find: function() {} };
    route.store = store;

    sinon.stub(store, 'find').withArgs('candidate').returns(expectedCandidates);

    Ember.run(function() {
        var model = route.model();

        equal(model, expectedCandidates);
    });
});
