import ArrangeableMixin from 'code-test-bot-app/mixins/arrangeable';
import SubmissionsIndexControllerBase from 'code-test-bot-app/controllers/submissions/base';

var SubmissionsActiveController = SubmissionsIndexControllerBase.extend(ArrangeableMixin, {
    filterProperties: [['active', true]],

    actions: {
        sortBy: function(sortProperties) {
            console.log('sortBy: ' + sortProperties);
            this.set('sortProperties', [sortProperties]);
        }
    }
});

export default SubmissionsActiveController;
