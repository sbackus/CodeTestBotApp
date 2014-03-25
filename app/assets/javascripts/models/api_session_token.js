
CodeTestBotApp.ApiSessionToken = Em.Object.extend({
    token: null,
    ttl: 0,

    hasToken: function() {
        var token = this.get('token');
        return token && typeof(token) === 'string' && token.length > 0;
    }.property('token'),

    refresh: function() {
        CodeTestBotApp.ApiSessionToken.acquire(this);
    }
});

CodeTestBotApp.ApiSessionToken.reopenClass({
    acquire: function(token) {
        token = token || CodeTestBotApp.ApiSessionToken.create({ token: localStorage.getItem('session_token') });
        var session = {
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
                        reject({ reason: 'expired', auth_url: data.auth_url });
                    }
                },
                error: function(xhr, status, error) {
                    var err = status + ': ' + error;
                    alert('Session Failure: ' + err);
                    reject({ reason: 'error', error: err });
                }
            });
        });
    }
});
