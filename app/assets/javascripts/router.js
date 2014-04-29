CodeTestBotApp.Router.reopen({
    location: 'history'
});

CodeTestBotApp.Router.map(function() {
    this.resource('candidates', function() {
        this.route('new');
    });

    this.resource('submissions', function() {
        this.route('new');

        this.resource('submission', { path: '/:submission_id' }, function() {
            this.resource('assessments', function() {
                this.route('new')
            });
        });
    });

    this.resource('users', function() {
        this.resource('user', { path: '/:user_id' }, function() {
            this.route('edit');
        });
    });

    this.resource('auth', function() {
        this.route('login');
        this.route('logout');
        this.route('complete');
    });
});

CodeTestBotApp.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin);

CodeTestBotApp.CandidatesIndexView = CodeTestBotApp.FoundationView.extend();
