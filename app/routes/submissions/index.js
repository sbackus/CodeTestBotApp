import Ember from 'ember';

var SubmissionsIndexRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('submission');
    },
    renderTemplate: function(controller, model) {
        this._super();
        this.render('submissions/active', {
            into: 'submissions/index',
            outlet: 'active',
            controller: 'submissions/active',
            model: model
        });
        this.render('submissions/inactive', {
            into: 'submissions/index',
            outlet: 'inactive',
            controller: 'submissions/inactive',
            model: model
        });
    }
});

export default SubmissionsIndexRoute;
