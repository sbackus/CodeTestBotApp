/* globals sinon, equal */

import { moduleFor, test } from 'ember-qunit';
import { injectFakeStore } from '../../../helpers/data';

var expectedCandidate;
moduleFor('route:candidates/new', 'Candidates New Route', {
    setup: function() {
        expectedCandidate = Ember.Object.create({ isNew: true });
        expectedCandidate.reopen({
            deleteRecord: sinon.spy()
        });
    }
});

test('model is new candidate record and list of levels', function() {
    var expectedCandidate = 'expectedCandidate';
    var expectedLevels = 'expectedLevels';

    var route = this.subject();
    var store = injectFakeStore(route);

    sinon.stub(store, 'createRecord').withArgs('candidate').returns(expectedCandidate);
    sinon.stub(store, 'find').withArgs('level').returns(expectedLevels);

    Ember.run(function() {
        var model = route.model();

        equal(model.get('candidate'), expectedCandidate);
        equal(model.get('levels'), expectedLevels);
    });
});

test('when leaving route, deletes the record if unsaved', function() {
    var route = this.subject();
    route.currentModel = Ember.Object.create({ candidate: expectedCandidate });

    Ember.run(function() {
        route.deactivate();
    });

    equal(expectedCandidate.deleteRecord.callCount, 1);
});

test('when leaving route, does not delete the record if it was saved', function() {
    var route = this.subject();
    route.currentModel = Ember.Object.create({ candidate: expectedCandidate });

    Ember.run(function() {
        expectedCandidate.set('isNew', false);
        route.deactivate();
    });

    equal(expectedCandidate.deleteRecord.callCount, 0);
});
