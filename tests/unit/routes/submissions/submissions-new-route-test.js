import { test, moduleFor } from 'ember-qunit';
import { injectFakeStore } from '../../../helpers/data';

moduleFor('route:submissions/new', 'Submissions New Route');

test('sets up the model with a new submission record, candidates, and languages', function() {
    var expectedSubmission = 'expectedSubmission';
    var expectedLevels = 'expectedLevels';
    var expectedLanguages = 'expectedLanguages';

    var route = this.subject();
    var store = injectFakeStore(route);

    var find = sinon.stub(store, 'find');
    find.withArgs('level').returns(expectedLevels);
    find.withArgs('language').returns(expectedLanguages);

    sinon.stub(store, 'createRecord').returns(expectedSubmission);

    Ember.run(function() {
        var model = route.model();

        equal(model.get('submission'), expectedSubmission);
        equal(model.get('levels'), expectedLevels);
        equal(model.get('languages'), expectedLanguages);
    });
});
