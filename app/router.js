var Router = Ember.Router.extend({
  rootURL: ENV.rootURL,
  location: 'auto'
});

Router.map(function() {
    this.resource('candidates', function() {
        this.route('new');
    });

    this.resource('submissions', function() {
        this.route('new');
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

export default Router;
