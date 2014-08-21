import Ember from 'ember';

export default Ember.ObjectController.extend({
   
       all_roles: function() {
           return this.store.find('role');
       }.property('model.all_roles'),
    actions: {
           changeRole: function() {
               var role = this.get('selectedRole');
               var user = this.get('content');
               user.set('role', role);
               user.save();
           }
    }
});
