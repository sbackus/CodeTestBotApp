import Ember from 'ember';
import UserAwareMixin from 'code-test-bot-app/mixins/user-aware';

export default Ember.Mixin.create(UserAwareMixin, {
    user: Ember.computed.alias('applicationController.user'),

    applicationController: function() {
        return this.controllerFor('application');
    }.property()
});
