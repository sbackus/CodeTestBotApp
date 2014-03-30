//= require spec_helper

describe('SubmissionsNewController', function() {
    var controller;

    beforeEach(function() {
        controller = testing().controller('submissions.new');
    });

    describe('isFormIncomplete', function() {
        it('is true when any field is empty', function() {
            controller.set('emailText', null);
            controller.set('file', null);
            expect(controller.get('isFormIncomplete')).to.be.true;

            controller.set('emailText', 'Some text');
            controller.set('file', null);
            expect(controller.get('isFormIncomplete')).to.be.true;

            controller.set('emailText', null);
            controller.set('file', 'some file');
            expect(controller.get('isFormIncomplete')).to.be.true;

            controller.set('emailText', 'Some text');
            controller.set('file', 'some file');
            expect(controller.get('isFormIncomplete')).to.be.false;
        });
    });
});
