//= require spec_helper

describe('CandidatesNewController', function() {
    var controller;

    beforeEach(function() {
        controller = testing().controller('candidates.new');
    });

    describe('isFormIncomplete', function() {
        it('is true when any field is empty', function() {
            var model = Ember.Object.create();
            controller.set('model', model);

            model.set('name', null);
            model.set('email', null);
            expect(controller.get('isFormIncomplete')).to.be.true;

            model.set('name', 'Bob');
            model.set('email', null);
            expect(controller.get('isFormIncomplete')).to.be.true;

            model.set('name', null);
            model.set('email', 'bob@example.com');
            expect(controller.get('isFormIncomplete')).to.be.true;

            model.set('name', 'Bob');
            model.set('email', 'bob@example.com');
            expect(controller.get('isFormIncomplete')).to.be.false;
        });
    });

    describe('createCandidate action', function() {
        beforeEach(function() {
            CodeTestBotApp.reset();
        });

        it('persists the submission model', function() {
            // TODO: needs auth handling for tests
        });
    });
});

