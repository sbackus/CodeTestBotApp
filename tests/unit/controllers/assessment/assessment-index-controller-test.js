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
            id: 2,
            name: 'Kate'
        });

        controller.set('model', model);
        controller.set('createdAtMoment', createdAt);
        controller.set('user', user);
        controller.set('assessor', assessor);
    }
});

test('createdAtRecently is true', function() {
    equal(controller.get('assessmentCreatedRecently'), true);
});


