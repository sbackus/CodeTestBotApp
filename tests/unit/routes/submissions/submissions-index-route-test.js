import { test, moduleFor } from 'ember-qunit';
import { injectFakeStore } from '../../../helpers/data';

moduleFor('route:submissions/index', 'Submissions Index Route');

test('model is a list of submissions', function() {
    var expectedSubmissions = 'expectedSubmissions';

    var route = this.subject();
    var store = injectFakeStore(route);
    sinon.stub(store, 'find').withArgs('submission').returns(expectedSubmissions);

    Ember.run(function() {
        var model = route.model();

        equal(model, expectedSubmissions);
    });
});