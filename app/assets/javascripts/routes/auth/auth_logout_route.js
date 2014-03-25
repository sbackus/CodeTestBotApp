CodeTestBotApp.AuthLogoutRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        var token = this.controllerFor('application').get('sessionToken');
        this.controllerFor('application').set('sessionToken', null);
        localStorage.removeItem('session_token');
        this.controllerFor('auth').set('loggedIn', false);
        $.ajax({
            dataType: 'json',
            data: { token: token.get('token') },
            url: 'http://localhost:3000/sessions',
            type: 'DELETE'
        });
        this.transitionTo('/');
    }
});