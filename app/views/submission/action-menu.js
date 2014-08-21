import Ember from 'ember';
import Router from 'code-test-bot-app/router';

export default Ember.View.extend({
    templateName: 'submission/action-menu',

    dropdownId: function() {
        return 'drop-menu-' + this.elementId;
    }.property(),

    mainLink: function() {
        // Can't just use link-to helper because it will preempt click handling from Foundation
        // (i.e. it will just redirect to the route instead of dropping down the menu)
        return Router.router.generate('submission.index', this.get('context'));
    }.property('context')
});
