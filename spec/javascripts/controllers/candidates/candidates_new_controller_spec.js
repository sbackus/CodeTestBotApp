//= require spec_helper

describe('CandidatesNewController', function() {
    var controller;
    var model;
    var candidate;

    beforeEach(function() {
        candidate = Ember.Object.create({name: 'Bob', email: 'bob@example.com', save: function(){}});
        controller = testing().controller('candidates.new');
        model = Ember.Object.create({
            candidate: candidate,
            levels: []
        });

        controller.set('model', model);
        controller.set('selectedLevel', {});
    });

    describe('isFormIncomplete', function() {
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
        it('persists the candidate model', function() {
            // TODO: needs auth handling for tests
        });

        it('redirects to the candidates page', function(done){
            sinon.stub(candidate, 'save').returns(new Ember.RSVP.resolve());
            sinon.stub(controller, 'transitionToRoute');
            testing().callAction(controller,'createCandidate').then(function() {
                expect(controller.transitionToRoute).to.have.been.calledWith('/candidates');
                done();
            });
        });
    });
});

