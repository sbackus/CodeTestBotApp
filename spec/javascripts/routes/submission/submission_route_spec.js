//= require spec_helper

describe('SubmissionRoute', function() {
    var route, store;

    beforeEach(function() {
        route = testing().route('submission');
        store = testing().store();
    });

    describe('model', function() {
        it('returns the submission by id from the submission_id parameter', function(done) {
            var submission = store.push('submission', { id: 1 });

            route.model({ submission_id: 1 }).then(function(model) {
                expect(model).to.eq(submission);
                done();
            }, testing().promiseErrorHandler(done));
        });
    });
});
