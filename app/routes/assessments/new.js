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
                model.set('languages', self.store.find('language'));
                model.set('levels', self.store.find('level'));
                model.set('assessor', self.store.push('assessor', assessor.toJSON({ includeId: true })));
                return model;
            } else {
                return assessments.get('firstObject');
            }
        });
    },

    setupController: function(controller, model) {
        this._super(controller, model);

        var submission = this.controllerFor('submission').get('model');
        model.set('submission', submission);
        controller.set('selectedLanguage', submission.get('language'));
        controller.set('selectedLevel', submission.get('level'));
    }
});
