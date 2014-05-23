export default DS.Model.extend({
    candidateName: DS.attr(),
    candidateEmail: DS.attr(),
    emailText: DS.attr(),
    zipfile: DS.attr(),
    active: DS.attr(),
    createdAt: DS.attr(),

    level: DS.belongsTo('level'),
    language: DS.belongsTo('language'),
    assessments: DS.hasMany('assessment'),

    candidateDisplay: function() {
        return this.get('candidateName') + ' <' + this.get('candidateEmail') + '>';
    }.property('candidateName', 'candidateEmail'),

    languageDisplay: function() {
        return Ember.isNone(this.get('language')) ? 'Unknown' : this.get('language.name');
    }.property('language'),

    createdAtDisplay: function() {
        return moment(this.get('createdAt')).format('l LT');
    }.property('createdAt')
});

