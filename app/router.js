var Router = Ember.Router.extend({
  rootURL: ENV.rootURL,
  location: 'auto'
});

Router.map(function() {
    this.resource('auth', function() {
        this.route('login');
    });
});

export default Router;
