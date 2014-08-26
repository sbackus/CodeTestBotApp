import Ember from 'ember';
import UserAwareRouteMixin from 'code-test-bot-app/mixins/user-aware-route';

export default Ember.Route.extend(UserAwareRouteMixin, {
    model: function() {
        var self = this;
        var submission = self.modelFor('submission');
        var assessor = this.modelFor('secured').get('user');
        return self.store.find('assessment', { submission_id: submission.get('id'), assessor_id: assessor.get('id'), include_unpublished: true }).then(function(assessments) {
            if (assessments.get('length') === 0) {
                var model = self.store.createRecord('assessment');
                model.set('published', false);
                model.set('assessor', self.store.push('assessor', assessor.toJSON({ includeId: true })));
                model.set('submission', submission);
                return model;
            } else {
                return assessments.get('firstObject');
            }
        });
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('languages', this.store.find('language'));
        controller.set('levels', this.store.find('level'));
    }
});
