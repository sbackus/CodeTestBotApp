import Ember from 'ember';
import WindowLocationHelper from 'code-test-bot-app/lib/window-location-helper';

var AuthLoginController = Ember.ObjectController.extend({
    actions: {
        login: function() {
            WindowLocationHelper.setLocation(this.get('model.auth_uri'));
        }
    }
});

export default AuthLoginController;
