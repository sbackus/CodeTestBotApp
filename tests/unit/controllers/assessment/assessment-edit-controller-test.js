import testFor from '../../../helpers/test-for';
import { randomElement } from '../../../helpers/utils';
import fakeServer from '../../../helpers/fake-server';
import { injectFakeStore } from '../../../helpers/data';

describe('Assessment Edit Controller', testFor('controller:assessment/edit', function() {
    var controller, store;
    var model, assessment;

    before(function() {
        controller = this.subject();
        store = injectFakeStore(controller);
        assessment = Ember.Object.create({
            score: 1,
            notes: 'some notes'
        });

        model = Ember.Object.create({
            assessment: assessment
        });

        controller.set('model', model);
        controller.set('id', 1);
        controller.set('score', 3);
        controller.set('notes', 'actually ok');
    });

    describe('#editAssessment', function() {
        context('assessment is edited', function() {
            it('assessment is updated and saved', function() {
                equal(assessment.get('score'), 1);
                equal(assessment.get('notes'), 'some notes');

                Ember.run(function() {
                    var find = sinon.stub(store, 'find');
                    find.withArgs('assessment').returns(assessment);
                    assessment.reopen({
                        save: sinon.spy()
                    })

                    controller.send('editAssessment');
                });
                equal(assessment.get('score'), 3);
                equal(assessment.get('notes'), 'actually ok');
                equal(assessment.save.callCount, 1);
            });
        });


    });
}));
