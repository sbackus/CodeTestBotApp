CodeTestBotApp.AuthController = Ember.Controller.extend({
    needs: ['application'],
    loggedIn: false,
    dataStoreBinding: 'controllers.application.dataStore',

    login: function(token) {
        this.set('loggedIn', true);
        this.get('dataStore').setItem('sessionToken', token);
    },

    logout: function() {
        var dataStore = this.get('dataStore');
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
