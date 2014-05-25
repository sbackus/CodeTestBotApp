
export default Ember.Mixin.create({
    user: null,

    isRecruiter: function() {
        return this.hasRole('Recruiter') || this.hasRole('Administrator');
    }.property('user.role.name'),

    isAdmin: function() {
        return this.hasRole('Administrator');
    }.property('user.role.name'),

    hasRole: function(roleName) {
        return this.get('user.role.name') === roleName;
    }
});
