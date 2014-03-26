CodeTestBotApp.AuthController = Ember.Controller.extend({
    loggedIn: false,

    login: function(token) {
        this.set('loggedIn', true);
        CodeTestBotApp.get('dataStore').setItem('sessionToken', token);
    },

    logout: function() {
        var dataStore = CodeTestBotApp.get('dataStore');
        var token = dataStore.getItem('sessionToken');

        this.set('loggedIn', false);
        dataStore.removeItem('sessionToken');

        $.ajax({
            dataType: 'json',
            data: { token: token },
            url: CONFIG.SERVER_HOST + '/sessions',
            type: 'DELETE'
        });
    }
});
