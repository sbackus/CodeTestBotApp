//= require spec_helper

describe('AssessmentsNewController', function() {
    var controller;
    var model;
    var assessment;

    beforeEach(function() {
        controller = testing().controller('assessments.new');

        assessment = Ember.Object.create({
            save: function() {}
        });

        model = Ember.Object.create({
            assessment: assessment
        });

        controller.set('model', model);

        sinon.stub(assessment, 'save').returns(Ember.RSVP.resolve());
    });

    afterEach(function() {
        assessment.save.restore();
    });

    describe('createAssessment', function() {
        it('saves the assessment', function(done) {
            testing().callAction(controller, 'createAssessment').then(function() {
                expect(assessment.save).to.have.been.called;
                done();
            });
        });

        it('redirects to the assessments index after save', function(done) {
            sinon.stub(controller, 'transitionToRoute');
            testing().callAction(controller, 'createAssessment').then(function() {
                expect(controller.transitionToRoute).to.have.been.calledWith('assessments.index');
                done();
            });
        });
    });
});
