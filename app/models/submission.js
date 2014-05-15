export default DS.Model.extend({
    emailText: DS.attr(),
    zipfile: DS.attr(),
    active: DS.attr(),
    createdAt: DS.attr(),

    candidate: DS.belongsTo('candidate'),
    language: DS.belongsTo('language'),
    assessments: DS.hasMany('assessment'),

    languageDisplay: function() {
        return Ember.isNone(this.get('language')) ? 'Unknown' : this.get('language.name');
    }.property('language'),

    createdAtDisplay: function() {
        return moment(this.get('createdAt')).format('l LT');
    }.property('createdAt')
});
