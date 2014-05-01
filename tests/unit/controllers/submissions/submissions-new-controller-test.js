/* globals sinon, equal, ok */

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
        controller.set('selectedCandidate', {});
    }
});

test('isFormIncomplete is false when all fields are filled', function() {
    equal(controller.get('isFormIncomplete'), false);
});

test('isFormIncomplete is true when any field is empty', function() {
    var fields = ['model.submission.emailText', 'model.submission.zipfile', 'selectedCandidate'];
    var field = randomElement(fields);

    Ember.run(function() {
        controller.set(field, null);
    });

    equal(controller.get('isFormIncomplete'), true);
});

test('createSubmssion sets the candidate and language and saves', function() {
    var expectedCandidate = 'expectedCandidate';
    var expectedLanguage = 'expectedLanguage';

    sinon.stub(controller, 'transitionToRoute');

    Ember.run(function() {
        submission.reopen({
            save: sinon.stub().returns(Ember.RSVP.resolve())
        });
        controller.set('selectedCandidate', expectedCandidate);
        controller.set('selectedLanguage', expectedLanguage);
        controller.send('createSubmission');
    });

    equal(submission.get('candidate'), expectedCandidate);
    equal(submission.get('language'), expectedLanguage);
});

test('createSubmission transitions to the submissions index after successful save', function() {
    var expectation = sinon.mock(controller).expects('transitionToRoute').once().withArgs('/submissions');

    Ember.run(function() {
        submission.reopen({
            save: sinon.stub().returns(Ember.RSVP.resolve())
        });
        controller.send('createSubmission');
    });

    ok(expectation.verify());
});
