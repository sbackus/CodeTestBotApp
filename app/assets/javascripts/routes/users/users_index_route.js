CodeTestBotApp.UsersIndexRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function() {
        return this.store.find('user');
    }
});
