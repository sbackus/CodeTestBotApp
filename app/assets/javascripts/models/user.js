CodeTestBotApp.User = DS.Model.extend({
    name: DS.attr(),
    email: DS.attr(),
    session: DS.hasMany('session')
});
