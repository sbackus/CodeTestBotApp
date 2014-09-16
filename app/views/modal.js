import Ember from 'ember';

var ModalView = Ember.View.extend({
  openModal: function() {
    this.$('.modal').modal();
  }.on('didInsertElement')
});

export default ModalView;
