
export default Ember.Mixin.create({
    user: null,

    isRecruiter: function() {
        return this.hasRole('Recruiter') || this.hasRole('Administrator');
    }.property('user.roles.[]'),

    isAdmin: function() {
        return this.hasRole('Administrator');
    }.property('user.roles.[]'),

    hasRole: function(roleName) {
        var roles = this.get('user.roleNames');
        return !Ember.isNone(roles) && roles.contains(roleName);
    }
});
