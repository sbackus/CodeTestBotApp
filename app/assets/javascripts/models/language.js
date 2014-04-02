CodeTestBotApp.Language = DS.Model.extend({
    name: DS.attr('string'),

    submissions: DS.hasMany('submission')
});
