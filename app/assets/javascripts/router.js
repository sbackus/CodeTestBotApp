CodeTestBotApp.Router.reopen({
    location: 'history'
});

CodeTestBotApp.Router.map(function() {
    this.resource('submissions', function() {
        this.route('new');
    });

    this.resource('auth', function() {
        this.route('login');
        this.route('logout');
        this.route('complete');
    });
});

CodeTestBotApp.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin);
