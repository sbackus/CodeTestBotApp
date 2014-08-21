import Ember from 'ember';
import { request } from 'ic-ajax';

export default Ember.Route.extend({
    model: function() {
        return request(CodeTestBotAppENV.NEW_SESSION_URL + '?redirect_uri=' + CodeTestBotAppENV.APP_HOST + '/auth/complete');
    }
});
