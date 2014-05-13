import { moduleFor, test } from 'ember-qunit';
import { randomElement } from '../../../helpers/utils';

var controller, submission, model;
moduleFor('controller:submissions/new', 'Submissions New Controller', {
    setup: function() {
        controller = this.subject();
        submission = Ember.Object.create({emailText: 'text', zipfile: 'file', save: function(){}});
        model = Ember.Object.create({
            submission: submission,
            candidates: []
        });
        controller.set('model', model);
        controller.set('candidateName', 'Bob');
        controller.set('candidateEmail', 'bob@example.com');
    }
});

test('isFormIncomplete is false when all fields are filled', function() {
    equal(controller.get('isFormIncomplete'), false);
});

test('isFormIncomplete is true when any field is empty', function() {
    var fields = ['submission.emailText', 'submission.zipfile', 'candidateName', 'candidateEmail'];
    var field = randomElement(fields);

    Ember.run(function() {
        controller.set(field, null);
    });

    equal(controller.get('isFormIncomplete'), true);
});
