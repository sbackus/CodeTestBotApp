export default Ember.ObjectController.extend({
   
       all_roles: function() {
           return this.store.find('role');
       }.property('model.all_roles'),
       update_user: function(user_id, role){
           var promises = {
                   user: this.store.find('user', user_id)
           };

           Ember.RSVP.hash(promises).then(function(hash){
                   var user = hash.user;
                   user.set('role', role);
                   user.save();

           });
    },
    actions: {
           changeRole: function() {
                   var role = this.get('selectedRole');
                   var user_id = this.get('id');
                   this.update_user(user_id, role);
               }
           }
});