import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return this.store.find('submission');
    },

    renderTemplate: function(controller, model) {
      this._super(controller, model);
      this.render('submissions/recently-closed', {
        into: 'secured/index',
        outlet: 'recentlyClosed',
        controller: 'submissions/recently-closed',
        model: model
      });
    }
});

