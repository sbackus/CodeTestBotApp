/* globals moment */

import { moduleFor, test } from 'ember-qunit';
import { randomElement } from '../../../helpers/utils';

var controller, createdAt, assessment, model, user, assessor;
moduleFor('controller:assessment/edit', 'Assessment Edit Controller', {
    needs: ['controller:application'],

    setup: function() {
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
            id: 1,
            name: 'Bob'
        });

        controller.set('content', assessment);
        controller.set('user', user);
        controller.set('assessor', assessor);
    }
});

test('ownAssessment is false if user id and assessor id dont match', function() {
    assessor.id = 5;
    user.id = 1;
    equal(controller.get('ownAssessment'), false);
});

test('notOwnAssessment is true if user id and assessor id dont match', function() {
    assessor.id = 5;
    user.id = 1;
    equal(controller.get('notOwnAssessment'), true);
});

test('ownAssessment is true if user id and assessor id match', function() {
    assessor.id = 2;
    user.id = 2;
    equal(controller.get('ownAssessment'), true);
});

test('notOwnAssessment is false if user id and assessor id match', function() {
    assessor.id = 5;
    user.id = 5;
    equal(controller.get('notOwnAssessment'), false);
});



