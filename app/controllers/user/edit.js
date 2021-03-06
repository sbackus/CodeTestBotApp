import Ember from 'ember';

export default Ember.ObjectController.extend({
  breadCrumb: Ember.computed.alias('name'),

  allRoles: function() {
    return this.store.find('role');
  }.property(),

  actions: {
    save: function() {
      var self = this;
      this.get('content').save().then(function() {
        self.transitionTo('users.index');
      });
    }
  }
});
