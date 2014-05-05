function authenticateSession() {
    var session = getSession();
    session.authenticate('authenticator:out-of-band-token', {
        access_token: 'fake_token',
        expires_at: (new Date().getTime() / 1000) + 86400,
        expires: true
    });
}

function getSession() {
    return CodeTestBotApp.__container__.lookup('session:main');
}

export { authenticateSession, getSession };