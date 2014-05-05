export default DS.Model.extend({
    emailText: DS.attr(),
    zipfile: DS.attr(),
    createdAt: DS.attr(),

    candidate: DS.belongsTo('candidate'),
    language: DS.belongsTo('language'),

    languageDisplay: function() {
        return Ember.isNone(this.get('language')) ? 'Unknown' : this.get('language.name');
    }.property('language')
});

