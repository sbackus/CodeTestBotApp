var Router = Ember.Router.extend({
  location: 'auto'
});

Router.map(function() {
    this.resource('candidates', function() {
        this.route('new');
    });

    this.resource('submissions', function() {
        this.route('new');

        this.resource('submission', { path: '/:submission_id' }, function() {
            this.resource('assessments', function() {
                this.route('new');
            });
        });
    });

    this.resource('assessment', { path: '/assessments/:assessment_id' }, function() {

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
