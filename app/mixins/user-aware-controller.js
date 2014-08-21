import Ember from 'ember';
import UserAwareMixin from 'code-test-bot-app/mixins/user-aware';

export default Ember.Mixin.create(UserAwareMixin, {
    needs: ['application'],
    user: Ember.computed.alias('controllers.application.user')
});

