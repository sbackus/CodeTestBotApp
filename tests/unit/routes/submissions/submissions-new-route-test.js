/* globals sinon, equal */

import { test, moduleFor } from 'ember-qunit';

moduleFor('route:submissions/new', 'Submissions New Route');

test('sets up the model with a new submission record, candidates, and languages', function() {
    var expectedSubmission = 'expectedSubmission';
    var expectedCandidates = 'expectedCandidates';
    var expectedLanguages = 'expectedLanguages';

    var route = this.subject();
    var store = { createRecord: function() {}, find: function() {} };
    route.store = store;

    var find = sinon.stub(store, 'find');
    find.withArgs('candidate').returns(expectedCandidates);
    find.withArgs('language').returns(expectedLanguages);

    sinon.stub(store, 'createRecord').returns(expectedSubmission);

    Ember.run(function() {
        var model = route.model();

        equal(model.get('submission'), expectedSubmission);
        equal(model.get('candidates'), expectedCandidates);
        equal(model.get('languages'), expectedLanguages);
    });
});
