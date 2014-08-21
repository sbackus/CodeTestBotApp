import Ember from 'ember';

export default Ember.View.extend({
    didInsertElement: function() {
        Ember.$(document).foundation();
        this._super();
    }
});
