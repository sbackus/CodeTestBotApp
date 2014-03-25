
CodeTestBotApp.ApiSessionToken = Em.Object.extend({
    token: null,
    ttl: 0,

    hasToken: function() {
        var token = this.get('token');
        return (token && typeof(token) === 'string' && token.length > 0) === true;
    }.property('token')
});

CodeTestBotApp.ApiSessionToken.reopenClass({
    acquire: function(token, dataStore) {
        token = token || CodeTestBotApp.ApiSessionToken.create({ token: dataStore.getItem('session_token') });
        var session = {
            // TODO: This needs to come from some config val
            return_to: 'http://localhost:3001/auth/complete'
        };

        if (token.get('hasToken')) {
            session.token = token.get('token');
        } else {
            session.token = Math.uuid();
        }

        return new Promise(function(resolve, reject) {
            $.ajax({
                dataType: 'json',
                data: session,
                url: 'http://localhost:3000/sessions',
                type: 'POST',
                success: function(data, status, xhr) {
                    if (data.api_session_token) {
                        token.set('token', data.api_session_token.token);
                        token.set('ttl', data.api_session_token.ttl);

                        resolve(token);
                    } else if (data.auth_url) {
                        resolve({ reason: 'expired', auth_url: data.auth_url });
                    }
                },
                error: function(xhr, status, error) {
                    reject(new Error(status + ': ' + error));
                }
            });
        });
    }
});
