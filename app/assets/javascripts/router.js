CodeTestBotApp.Router.reopen({
    location: 'history'
});

CodeTestBotApp.Router.map(function() {
    this.resource('submissions', function() {
        this.route('new');
    });
});