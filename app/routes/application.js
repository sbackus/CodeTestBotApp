import Ember from 'ember';
import WWWAuthenticateHeader from 'code-test-bot-app/lib/auth/www-authenticate-header';

var CONTINUE_ERROR_HANDLING = true;
var STOP_ERROR_HANDLING = false;

export default Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    handleUnauthorized: function(xhr) {
        var header = WWWAuthenticateHeader.parse(xhr);
        if (header.get('isEmpty') || header.get('isInvalidToken')) {
            this.transitionTo('auth.login');
            return STOP_ERROR_HANDLING;
        }

        return CONTINUE_ERROR_HANDLING;
    },

    renderTemplate: function(controller, model) {
        this._super(controller, model);
        this.render('menu', {
            into: 'application',
            outlet: 'menu',
            controller: 'menu'
        });
    },

    handleAjaxError: function(error) {
        if (typeof(error) !== 'object') {
            return CONTINUE_ERROR_HANDLING;
        }

        var xhr = error.jqXHR ? error.jqXHR : error;
        if (xhr && xhr.hasOwnProperty('status') && xhr.hasOwnProperty('getResponseHeader')) {
            if (xhr.status === 401) {
                if(this.handleUnauthorized(xhr) === STOP_ERROR_HANDLING) {
                    return STOP_ERROR_HANDLING;
                }
            }
        }

        return CONTINUE_ERROR_HANDLING;
    },

    actions: {
        error: function(error) {
            if (this.handleAjaxError(error) === STOP_ERROR_HANDLING) {
                return STOP_ERROR_HANDLING;
            }

            return CONTINUE_ERROR_HANDLING;
        },
        unauthorized: function(jqXHR) {
            this.handleUnauthorized(jqXHR);
        },

        openModal: function(modalName, model) {
            this.controllerFor(modalName).set('model', model);
            return this.render(modalName, {
                into: 'application',
                outlet: 'modal',
            });
        },

        closeModal: function() {
            return this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'application'
            });
        }
    }
});
