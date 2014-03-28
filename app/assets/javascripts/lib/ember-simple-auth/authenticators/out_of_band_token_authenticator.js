
Ember.SimpleAuth.Authenticators.OutOfBandTokenAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
    restore: function(data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (!Ember.isEmpty(data.access_token)) {
                var now = (new Date()).getTime();
                if (!Ember.isEmpty(data.expires_at) && data.expires_at < now) {
                    reject();
                } else {
                    resolve(data);
                }
            } else {
                reject();
            }
        });
    },

    authenticate: function(token_data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            token_data.expires_at *= 1000;
            resolve(token_data);
        });
    },

    invalidate: function() {
        // TODO: delete from server
        return new Ember.RSVP.resolve();
    }
});