import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

export default Ember.ObjectController.extend(UserAwareControllerMixin, {

    ownAssessment: function(){
        return this.get('user.id') === this.get('assessor.id');
    }.property('ownAssessment'),
    isActive: function (){
        return this.get('submission').get('active');
    }.property('isActive'),
    isInactive: Ember.computed.not('isActive'),
    canEdit: Ember.computed.and('ownAssessment', 'isActive')
});


