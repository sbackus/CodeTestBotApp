//= require spec_helper

describe('SubmissionsNewController', function() {
    var controller;

    beforeEach(function() {
        controller = testing().controller('submissions.new');
    });

    describe('isFormIncomplete', function() {
        var model;
        beforeEach(function() {
            model = Ember.Object.create({
                submission: Ember.Object.create({emailText: 'text', zipfile: 'file'}),
                candidates: []
            });

            controller.set('model', model);
            controller.set('selectedCandidate', {});
        });

        it('is false when all fields are filled', function() {
            expect(controller.get('isFormIncomplete')).to.be.false;
        });

        it('is true when any field is empty', function() {
            var fields = ['model.submission.emailText', 'model.submission.zipfile', 'selectedCandidate'];
            var field = testing().randomElement(fields);

            controller.set(field, null);

            expect(controller.get('isFormIncomplete')).to.be.true;
        });
    });

    describe('createSubmission action', function() {
        beforeEach(function() {
            CodeTestBotApp.reset();
        });

        it('persists the submission model', function() {
            // TODO: needs auth handling for tests
        });
    });
});
