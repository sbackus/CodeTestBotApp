//= require ./assessor

CodeTestBotApp.Assessment = DS.Model.extend({
    score: DS.attr(),
    notes: DS.attr(),
    submission: DS.belongsTo('submission'),
    assessor: DS.belongsTo('assessor')
});
