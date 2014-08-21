import Ember from 'ember';
import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

export default Ember.ObjectController.extend(UserAwareControllerMixin, {
    ownAssessment: function(){
        return this.get('user.id') === this.get('assessor.id');
    }.property('ownAssessment').volatile(),
    assessmentCreatedRecently: function(){
        var createdAt = this.get('createdAtMoment');
        var expiryTime = createdAt.add('hours', 1);
        var now = moment();
        return moment(now).isBefore(expiryTime);
    }.property('assessmentCreatedRecently').volatile(),
    isInactive: Ember.computed.not('assessmentCreatedRecently').volatile(),
    canEdit: Ember.computed.and('ownAssessment', 'assessmentCreatedRecently').volatile()
});


