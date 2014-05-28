/* globals moment */

import { moduleFor, test } from 'ember-qunit';
import { randomElement } from '../../../helpers/utils';

var controller, createdAt, assessment, model, user, assessor;
moduleFor('controller:assessment/index', 'Assessment Index Controller', {
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

        controller.set('model', model);
        controller.set('createdAtMoment', createdAt);
        controller.set('user', user);
        controller.set('assessor', assessor);
    }
});

test('createdAtRecently is true for assessment created one minute ago', function() {
    createdAt = createdAt.minutes(-1);
    equal(controller.get('assessmentCreatedRecently'), true);
});

test('createdAtRecently is false for assessment created yesterday', function() {
    createdAt = createdAt.days(-1);
    equal(controller.get('assessmentCreatedRecently'), false);
});

test('ownAssessment is true when user and assessor have the same id', function() {
    equal(controller.get('ownAssessment'), true);
});

test('ownAssessment is false when user and assessor have different ids', function() {
    assessor.id = 5;
    equal(controller.get('ownAssessment'), false);
});

test('canEdit is true when user and assessor have the same id and assessment was created recently', function() {
    createdAt = createdAt.minutes(-1);
    equal(controller.get('canEdit'), true);
});

test('canEdit is false when user and assessor have the same id and assessment was not created recently', function() {
    createdAt = createdAt.days(-1);
    equal(controller.get('canEdit'), false);
});

test('canEdit is false when user and assessor do not have the same id and assessment was created recently', function() {
    createdAt = createdAt.minutes(-1);
    assessor.id = 5;
    equal(controller.get('canEdit'), false);
});



