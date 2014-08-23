import Ember from 'ember';
import ArrangeableMixin from 'code-test-bot-app/mixins/arrangeable';
import SubmissionsIndexControllerBase from 'code-test-bot-app/controllers/submissions/base';

var SubmissionsInactiveController = SubmissionsIndexControllerBase.extend(ArrangeableMixin, {
    filterProperties: [['active', false]],

    actions: {
        sortBy: function(sortProperties) {
            console.log('sortBy: ' + sortProperties);
            this.set('sortProperties', [sortProperties]);
        }
    }
});

export default SubmissionsInactiveController;
