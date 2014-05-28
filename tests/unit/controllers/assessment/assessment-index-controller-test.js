/* globals moment */

import testFor from '../../../helpers/test-for';
import { randomElement } from '../../../helpers/utils';

describe('Assessment Index Controller', testFor('controller:assessment/index', function() {
    var controller;
    var model, assessment, createdAt, user, assessor;

    before(function() {
        controller = this.subject();
        createdAt = moment();
        assessment = Ember.Object.create({
            score: 1,
            notes: 'some notes',
            createdAtMoment: createdAt
        });

        model = Ember.Object.create({
            assessment: assessment
        });

        user = Ember.Object.create({
            id: 1,
            name: 'Bob'
        });

        assessor = Ember.Object.create({
            id: 2,
            name: 'Kate'
        });

        controller.set('model', model);
        controller.set('createdAtMoment', createdAt);
        controller.set('user', user);
        controller.set('assessor', assessor);
    });

    describe('#assessmentCreatedRecently', function() {

        context('assessment created yesterday', function() {
            it('assessment was not created recently', function() {
                createdAt = createdAt.day(-1);
                expect(controller.get('assessmentCreatedRecently')).to.be.false();
            });
        });
    });
}));
