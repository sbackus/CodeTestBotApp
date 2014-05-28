import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

export default Ember.ObjectController.extend(UserAwareControllerMixin, {

    ownAssessment: function(){
        return this.get('user.id') === this.get('assessor.id');
    }.property('ownAssessment').volatile(),
    isActive: function (){
        return this.get('submission').get('active');
    }.property('isActive').volatile(),
    isInactive: Ember.computed.not('isActive').volatile(),
    canEdit: Ember.computed.and('ownAssessment', 'isActive').volatile()
});


