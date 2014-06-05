
export default Ember.View.extend({
    templateName: 'saving-indicator',
    message: '',
    spinner: null,

    didInsertElement: function() {
        this.$().hide();
        this.set('spinner', this.$('.fa-spinner'));
    },

    onSaveStatusChange: function() {
        if (this.get('controller.isSaving')) {
            this.set('message', 'Saving...');
            this.spinner.show();
            this.$().show();
        } else {
            this.set('message', 'Changes saved.');
            this.spinner.hide();
            if (this.$().is(':visible')) {
                Ember.run.later(this.$(), function() {
                    if (this) {
                        this.fadeOut('slow');
                    }
                }, 2000);
            }
        }
    }.observes('controller.isSaving')
});

