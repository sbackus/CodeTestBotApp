CodeTestBotApp.Session = DS.Model.extend({
    token: DS.attr(),
    tokenExpiry: DS.attr(),
    user: DS.belongsTo('user')
});
