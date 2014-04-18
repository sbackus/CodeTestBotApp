//= require ./user

CodeTestBotApp.Assessor = CodeTestBotApp.User.extend({
    toString: function() {
        return this.get('name') + ' <' + this.get('email') + '>';
    }
});
