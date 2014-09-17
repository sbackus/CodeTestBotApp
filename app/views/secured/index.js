import Ember from 'ember';

var SecuredIndexView = Ember.View.extend({
  onInsert: function() {
    this.$('.panel').matchHeight();
  }.on('didInsertElement'),

  onContentChanged: function() {
    Ember.$.fn.matchHeight._update();
  }.on('contentDidChange'),

  unfinishedChanged: function() {
    this.trigger('contentDidChange');
  }.observes('controller.submissionsWithUnfinishedAssessment'),

  needingAssessmentChanged: function() {
    this.trigger('contentDidChange');
  }.observes('controller.submissionsNeedingAssessment'),
});

export default SecuredIndexView;
