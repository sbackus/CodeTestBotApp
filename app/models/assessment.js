/* globals marked */

export default DS.Model.extend({
    score: DS.attr(),
    notes: DS.attr(),
    createdAt: DS.attr(),
    submission: DS.belongsTo('submission'),
    assessor: DS.belongsTo('assessor'),

    createdAtDisplay: function() {
        return moment(this.get('createdAt')).format('l LT');
    }.property('createdAt'),
    
    notesDisplay: function() {
        var renderer = new marked.Renderer();
        return marked(this.get('notes'), { renderer: renderer });
    }.property('notes')
});
