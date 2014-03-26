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
            url: CONFIG.SESSIONS_URL,
            type: 'DELETE'
        });
    },

    handleAuthResponse: function(response, redirect, transition) {
        if (response.result === 'success') {
            this.login(response.token.get('token'));
        } else if (response.result === 'auth_required') {
            if (transition) {
                transition.abort();
            }

            if (redirect === true) {
                WindowLocationHelper.setLocation(response.auth_url);
            } else {
                this.transitionToRoute('auth.login');
            }
        }
    }
});
