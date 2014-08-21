import Ember from 'ember';

export default Ember.ObjectController.extend({
    actions: {
        deleteSubmission: function() {
            var submission = this.get('content');
            submission.deleteRecord();
            submission.save();
            this.send('closeModal');
        }
    }
});
