export default DS.Model.extend({
    name: DS.attr(),
    email: DS.attr(),
    imageUrl: DS.attr(),
    editable: DS.attr(),
    session: DS.hasMany('session'),
    roles: DS.hasMany('role'),

    roleNames: Ember.computed.mapBy('roles', 'name'),

    roleDisplay: function() {
        var names = this.get('roleNames');
        if (names.contains('Administrator')) {
            return 'Administrator';
        } else if (names.contains('Recruiter')) {
            return 'Recruiter';
        } else if (names.contains('Assessor')) {
            return 'Assessor';
        }
        else {
            return 'No current role';
        }
    }.property('roleNames')
});
