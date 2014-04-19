CodeTestBotApp.User = DS.Model.extend({
    name: DS.attr(),
    email: DS.attr(),
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
        } else {
            return 'Assessor';
        }
    }.property('roleNames')
});
