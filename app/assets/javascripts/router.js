CodeTestBotApp.Router.reopen({
    location: 'history'
});

CodeTestBotApp.Router.map(function () {
    this.resource('submissions', function () {
        this.route('new');
    });

    this.resource('auth', function () {
        this.route('login');
        this.route('logout');
        this.route('complete', { path: '/complete/:token', queryParams: ['token'] });
    });
});

CodeTestBotApp.SubmissionsNewRoute = CodeTestBotApp.AuthenticatedRoute.extend({

});
