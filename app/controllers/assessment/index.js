import Ember from 'ember';
import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';
import Score from 'code-test-bot-app/models/score';

export default Ember.ObjectController.extend(UserAwareControllerMixin, {
    breadCrumb: function() {
      return 'Assessment by %@'.fmt(this.get('assessor.name'));
    }.property('assessor.name'),

    ownAssessment: function(){
        return this.get('user.id') === this.get('assessor.id');
    }.property('ownAssessment').volatile(),

    assessmentCreatedRecently: function(){
        var createdAt = this.get('createdAtMoment');
        var expiryTime = createdAt.add('hours', 1);
        var now = moment();
        return moment(now).isBefore(expiryTime);
    }.property('assessmentCreatedRecently').volatile(),

    scoreText: function() {
        return Score.displayTextForScore(this.get('score'));
    }.property('score'),

    isInactive: Ember.computed.not('assessmentCreatedRecently').volatile(),
    canEdit: Ember.computed.and('ownAssessment', 'assessmentCreatedRecently').volatile()
});


