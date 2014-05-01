/* globals ENV */

import { defineFixture } from 'ic-ajax';

defineFixture(ENV.NEW_SESSION_URL + '?redirect_uri=' + ENV.APP_HOST + '/auth/complete', {
    response: {auth_uri: 'testing_uri'},
    jqXHR: {},
    textStatus: 'success'
});

defineFixture(ENV.SERVER_HOST + '/users', {
    response: { users: [
        { id: 1, name: 'User1', editable: true },
        { id: 2, name: 'User2', editable: false }
    ]},
    jqXHR: {},
    textStatus: 'success'
});