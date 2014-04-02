CodeTestBotApp.Candidate = DS.Model.extend({
    name: DS.attr(),
    email: DS.attr(),
    level: DS.belongsTo('level'),

    display: function() {
        return this.get('name') + ' <' + this.get('email') + '>';
    }.property('name', 'email')
});
