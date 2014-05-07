import testFor from '../../../helpers/test-for';
import { randomElement } from '../../../helpers/utils';

describe('Assessments New Controller', testFor('controller:assessments/new', function() {
    var controller;
    var model, assessment;

    before(function() {
        controller = this.subject();

        assessment = Ember.Object.create({
            score: 1,
            notes: 'some notes'
        });

        model = Ember.Object.create({
            assessment: assessment
        });

        controller.set('model', model);
    });

    describe('#isFormIncomplete', function() {
        context('when all fields filled', function() {
            it('is false', function() {
                expect(controller.get('isFormIncomplete')).to.be.false();
            });
        });

        context('when any field empty', function() {
            before(function() {
                var fields = ['score', 'notes'];
                assessment.set(randomElement(fields), null);
            });

            it('is true', function() {
                expect(controller.get('isFormIncomplete')).to.be.true();
            });
        });
    });
}));
