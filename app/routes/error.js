import Ember from 'ember';

export default Ember.Route.extend({
    setupController: function(controller, model) {
        var error = model;
        if (this._isXHR(model)) {
            if (model.status === 403) {
                error = new Error('You do not have permission to access this page.');
            } else {
                error = new Error('Unhandled AJAX error ' + model.status + ' ' + model.responseText);
            }
        }

        Ember.onerror(error);
        controller.set('model', error);
    },

    _isXHR: function(obj) {
        if (typeof(obj) !== 'object') {
            return false;
        }

        return obj && obj.hasOwnProperty('status') && obj.hasOwnProperty('getResponseHeader');
    }
});
