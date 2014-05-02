export default DS.Model.extend({
    score: DS.attr(),
    notes: DS.attr(),
    submission: DS.belongsTo('submission'),
    assessor: DS.belongsTo('assessor')
});
