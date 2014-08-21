import Ember from 'ember';

export default Ember.ObjectController.extend({
    editDisabled: Ember.computed.not('editable')
});
