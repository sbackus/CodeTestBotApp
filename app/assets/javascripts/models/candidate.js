CodeTestBotApp.Candidate = DS.Model.extend({
    name: DS.attr(),
    email: DS.attr(),

    display: function() {
        return this.get('name') + ' <' + this.get('email') + '>';
    }.property('name', 'email')
});
