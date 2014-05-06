import { testFor } from '../../../helpers/test-for';

describe('AssessmentsNewController', testFor('controller:assessments/new', function() {
    describe('createAssessment action', function() {
        it('saves the assessment', function() {
            var controller = this.subject();
            var save = sinon.spy();
            var assessment = Ember.Object.create({ save: save });
            var model = Ember.Object.create({ assessment: assessment });

            Ember.run(function() {
                controller.set('model', model);
                controller.send('createAssessment');
            });

            expect(save.calledOnce).to.be.true();
        });
    });
}));
