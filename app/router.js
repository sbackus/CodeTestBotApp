var Router = Ember.Router.extend({
  rootURL: ENV.rootURL,
  location: 'auto'
});

Router.map(function() {
    this.resource('submissions', function() {
        this.route('new');
    });

    this.resource('auth', function() {
        this.route('login');
        this.route('logout');
        this.route('complete');
    });
});

export default Router;
