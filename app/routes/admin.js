import UserAwareRouteMixin from 'code-test-bot-app/mixins/user-aware-route';

export default Ember.Route.extend(UserAwareRouteMixin, {
    setupController: function(controller, model) {
        if (!this.get('isAdmin')) {
            throw new Error('You must be an administrator to access this area.');
        }

        this._super(controller, model);
    }
});
