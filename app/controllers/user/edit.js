import request from 'ic-ajax';

export default Ember.ObjectController.extend({

    all_roles: function() {
        return this.store.find('role');
    }.property('model.all_roles'),
    update_user: function(user_id, role, action){
        var promises = {
            user: this.store.find('user', user_id)
        };

        Ember.RSVP.hash(promises).then(function(hash){
            var user = hash.user;
            var roles = user.get('roles');

            if(action === 'add_role'){
                if(role != null && !roles.contains(role)){
                    roles.pushObject(role);
                }
            }
            else {
                roles.removeObject(role);
            }
            user.get('roles').then(function (got_roles){
                var role_ids = [];
                got_roles.forEach(function(item){
                    role_ids.push(item.get('id'));
                });
                var update_url = ENV.SERVER_HOST + '/users/' +user_id;
                request({
                    type: 'PUT',
                    url: update_url,
                    data: { user: { name: user.get('name'), email: user.get('email'), role_ids: role_ids}, id: user_id }
                }).then(function() {

                });
            });

        });
    },
    actions: {
        addRole: function() {
            var role = this.get('selectedRole');
            var user_id = this.get('id');
            this.update_user(user_id, role, 'add_role');
        },

        removeRole: function(role) {
            var user_id = this.get('id');
            this.update_user(user_id, role, 'remove_role');
        }

    }
});
