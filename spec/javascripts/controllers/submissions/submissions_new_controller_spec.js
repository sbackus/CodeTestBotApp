//= require spec_helper

describe('SubmissionsNewController', function() {
    var controller;

    beforeEach(function() {
        controller = testing().controller('submissions.new');
    });

    describe('isFormIncomplete', function() {
        it('is true when any field is empty', function() {
            var model = Ember.Object.create();
            controller.set('model', model);
            
            model.set('emailText', null);
            model.set('zipfile', null);
            expect(controller.get('isFormIncomplete')).to.be.true;

            model.set('emailText', 'Some text');
            model.set('zipfile', null);
            expect(controller.get('isFormIncomplete')).to.be.true;

            model.set('emailText', null);
            model.set('zipfile', 'some file');
            expect(controller.get('isFormIncomplete')).to.be.true;

            model.set('emailText', 'Some text');
            model.set('zipfile', 'some file');
            expect(controller.get('isFormIncomplete')).to.be.false;
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
