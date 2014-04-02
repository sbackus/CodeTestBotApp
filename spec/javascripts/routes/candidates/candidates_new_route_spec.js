//= require spec_helper

describe('CandidatesNewRoute', function() {
    var route;

    beforeEach(function() {
        route = testing().route('candidates.new');
    });

    describe('when leaving the route', function() {
        var candidate;
        beforeEach(function() {
            candidate = Ember.Object.create({
                isNew: true,
                deleteRecord: sinon.stub()
            });
            route.set('currentModel', {candidate: candidate});
        });

        it('deletes the new candidate record if it was not saved', function() {
            route.deactivate();

            expect(candidate.deleteRecord).to.have.been.called;
        });

        it('does not delete the record if it was saved', function() {
            candidate.set('isNew', false);
            route.deactivate();

            expect(candidate.deleteRecord).not.to.have.been.called;
        });
    });
});
