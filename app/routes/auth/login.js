import { request } from 'ic-ajax';

export default Ember.Route.extend({
    model: function() {
        return request(ENV.NEW_SESSION_URL + '?redirect_uri=' + ENV.APP_HOST + '/auth/complete');
    }
});
