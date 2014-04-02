//= require spec_helper

describe('CandidatesNewController', function() {
    var controller;

    beforeEach(function() {
        controller = testing().controller('candidates.new');
    });

    describe('isFormIncomplete', function() {
        var model;
        beforeEach(function() {
            model = Ember.Object.create({
                candidate: Ember.Object.create({name: 'Bob', email: 'bob@example.com'}),
                levels: []
            });

            controller.set('model', model);
            controller.set('selectedLevel', {});
        });

        it('is false when all fields are filled', function() {
            expect(controller.get('isFormIncomplete')).to.be.false;
        });

        it('is true when any field is empty', function() {
            var fields = ['model.candidate.name', 'model.candidate.email', 'selectedLevel'];
            var field = testing().randomElement(fields);

            controller.set(field, null);

            expect(controller.get('isFormIncomplete')).to.be.true;
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

