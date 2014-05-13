function findOrCreate(find, create, thisArg) {
    return find.call(thisArg).then(function(result) {
        return Ember.isNone(result) ? create.call(thisArg) : result;
    });
}

export default Ember.ObjectController.extend({
    candidateName: null,
    candidateEmail: null,
    selectedLanguage: null,
    selectedLevel: null,

    isFormIncomplete: Ember.computed.or('isCandidateIncomplete', 'isSubmissionIncomplete'),

    isCandidateIncomplete: function() {
        return Ember.isEmpty(this.get('candidateName')) ||
            Ember.isEmpty(this.get('candidateEmail'));
    }.property('candidateName', 'candidateEmail'),

    isSubmissionIncomplete: function() {
        return Ember.isEmpty(this.get('submission.emailText')) ||
            Ember.isEmpty(this.get('submission.zipfile'));
    }.property('submission.emailText', 'submission.zipfile'),

    findCandidate: function() {
        return this.store.find('candidate', { email: this.get('candidateEmail') }).then(function(results) {
            return results.get('firstObject');
        });
    },

    createCandidate: function() {
        var candidate = this.store.createRecord('candidate', {
            name: this.get('candidateName'),
            email: this.get('candidateEmail'),
            level: this.get('selectedLevel')
        });

        return candidate.save().then(function() {
            return candidate;
        });
    },

    createSubmission: function(candidate) {
        var submission = this.get('submission');
        submission.set('candidate', candidate);
        submission.set('language', this.get('selectedLanguage'));
        return submission.save();
    },

    actions: {
        submit: function() {
            var self = this;
            findOrCreate(self.findCandidate, self.createCandidate, self)
                .then(self.createSubmission.bind(self))
                .then(function() {
                    self.transitionToRoute('/submissions');
                });
        }
    }
});
