var Router = Ember.Router.extend({
  location: 'auto'
});

Router.map(function() {
    this.resource('auth', function() {
        this.route('login');
        this.route('logout');
        this.route('complete');
    });

    this.resource('secured', { path: '/' }, function() {
        this.resource('submissions', function() {
            this.route('new');

            this.resource('submission', { path: '/:submission_id' }, function() {
                this.route('report');

                this.resource('assessments', function() {
                    this.route('new');
                });
            });
        });

        this.resource('assessments', function() {
            this.resource('assessment', { path: '/:assessment_id' }, function() {
                this.route('edit');
            });
        });
        
        this.resource('users', function() {
            this.resource('user', { path: '/:user_id' }, function() {
                this.route('edit');
            });
        });
    });
});

export default Router;
