import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

export default Ember.ObjectController.extend(UserAwareControllerMixin, {

    canEdit: function(){
        return this.get('user.id') === this.get('assessor.id');
    }.property('canEdit')

});


