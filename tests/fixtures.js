import { defineFixture } from 'ic-ajax';

defineFixture(ENV.NEW_SESSION_URL + '?redirect_uri=' + ENV.APP_HOST + '/auth/complete', {
    response: {auth_uri: 'testing_uri'},
    jqXHR: {},
    textStatus: 'success'
});
