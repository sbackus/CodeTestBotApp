import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    candidateName: DS.attr(),
    candidateEmail: DS.attr(),
    emailText: DS.attr(),
    zipfile: DS.attr(),
    fileName: DS.attr(),
    active: DS.attr(),
    createdAt: DS.attr(),
    updatedAt: DS.attr(),
    averageScore: DS.attr(),

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
    }.property('createdAt'),
    updatedAtDisplay: function() {
        return moment(this.get('updatedAt')).format('l LT');
    }.property('updatedAt')

});

