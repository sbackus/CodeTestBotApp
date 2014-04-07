//= require spec_helper

describe('SubmissionsNewController', function() {
    var controller;
    var model;
    var submission;
    beforeEach(function() {
        submission = Ember.Object.create({emailText: 'text', zipfile: 'file', save: function(){}});
        controller = testing().controller('submissions.new');
        model = Ember.Object.create({
            submission: submission,
            candidates: []
        });
        controller.set('model', model);
        controller.set('selectedCandidate', {});
    });

    describe('isFormIncomplete', function() {
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
        it('persists the submission model', function() {
            // TODO: needs auth handling for tests
        });

        it('redirects to the sumbission page', function(done){
            sinon.stub(submission, 'save').returns(new Ember.RSVP.resolve());
            sinon.stub(controller, 'transitionToRoute');
            testing().callAction(controller,'createSubmission').then(function() {
                expect(controller.transitionToRoute).to.have.been.calledWith('/submissions');
                done();
            });
        });
    });
});
