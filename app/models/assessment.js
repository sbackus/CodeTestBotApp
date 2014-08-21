/* globals marked */
import DS from 'ember-data';

export default DS.Model.extend({
    score: DS.attr(),
    notes: DS.attr(),
    published: DS.attr(),
    createdAt: DS.attr(),
    updatedAt: DS.attr(),
    submission: DS.belongsTo('submission'),
    assessor: DS.belongsTo('assessor'),

    createdAtDisplay: function() {
        return this.get('createdAtMoment').format('l LT');
    }.property('createdAtMoment'),

    createdAtMoment: function() {
        return moment(this.get('createdAt'));
    }.property('createdAt'),

    updatedAtDisplay: function() {
        return moment(this.get('updatedAt')).format('l LT');
    }.property('updatedAt'),
    
    notesDisplay: function() {
        var renderer = new marked.Renderer();
        return marked(this.get('notes'), { renderer: renderer });
    }.property('notes')
});
