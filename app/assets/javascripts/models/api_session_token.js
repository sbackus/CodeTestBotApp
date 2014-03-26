CodeTestBotApp.ApiSessionToken = Em.Object.extend({
    token: null,
    ttl: 0,

    hasToken: function() {
        var token = this.get('token');
        return (token && typeof(token) === 'string' && token.length > 0) === true;
    }.property('token')
});

CodeTestBotApp.ApiSessionToken.reopenClass({
    acquire: function(token) {
        token = token || CodeTestBotApp.ApiSessionToken.create({ token: CodeTestBotApp.get('dataStore').getItem('sessionToken') });
        var session = {
            return_to: CONFIG.APP_HOST + '/auth/complete'
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
                url: CONFIG.SESSIONS_URL,
                type: 'POST',
                success: function(data, status, xhr) {
                    if (data.api_session_token) {
                        token.set('token', data.api_session_token.token);
                        token.set('ttl', data.api_session_token.ttl);

                        resolve({ result: 'success', token: token });
                    } else if (data.auth_url) {
                        resolve({ result: 'auth_required', auth_url: data.auth_url });
                    } else {
                        reject(new Error('Unexpected response: ' + data.toString()));
                    }
                },
                error: function(xhr, status, error) {
                    reject(new Error(status + ': ' + error));
                }
            });
        });
    }
});
