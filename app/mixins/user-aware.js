
export default Ember.Mixin.create({
    user: null,

    isRecruiter: function() {
        return this.hasRole('Recruiter') || this.hasRole('Administrator');
    }.property('user.roles.[]'),

    hasRole: function(roleName) {
        return this.get('user.roleNames').contains(roleName);
    }
});