/* globals sinon, equal */

import { moduleFor, test } from 'ember-qunit';
import { randomElement } from '../../../helpers/utils';

var controller, candidate;
moduleFor('controller:candidates/new', 'Candidates New Controller', {
    setup: function() {
        controller = this.subject();
        candidate = Ember.Object.create({name: 'Bob', email: 'bob@example.com'});
        var model = Ember.Object.create({
            candidate: candidate,
            levels: []
        });

        Ember.run(function() {
            controller.set('model', model);
            controller.set('selectedLevel', {});
        });
    }
});

test('isFormIncomplete is false when all fields are filled', function() {
    equal(controller.get('isFormIncomplete'), false);
});

test('isFormIncomplete is true when any field is empty', function() {
    var fields = ['model.candidate.name', 'model.candidate.email', 'selectedLevel'];
    var field = randomElement(fields);

    Ember.run(function() {
        controller.set(field, null);
    });

    equal(controller.get('isFormIncomplete'), true);
});

test('createCandidate action sets the selectedLevel and saves the candidate', function() {
    var expectedLevel = 'expectedLevel';

    Ember.run(function() {
        candidate.reopen({
            save: sinon.spy()
        });
        controller.set('selectedLevel', expectedLevel);
        controller.send('createCandidate');
    });

    equal(controller.get('model.candidate.level'), expectedLevel);
    equal(candidate.save.callCount, 1);
});
