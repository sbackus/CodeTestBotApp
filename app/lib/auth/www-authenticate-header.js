var split = String.prototype.split;

var WWWAuthenticateHeader = Ember.Object.extend({
    rawHeader: null,
    error: null,

    init: function() {
        var self = this;
        var parts = split.call(this.get('rawHeader'), ' ');
        parts.shift();
        parts.forEach(function(pair) {
            pair = split.call(pair, '=');
            if (pair[0] === 'error') {
                self.set('error', pair[1]);
            }
        });
    },

    isEmpty: function() {
        return Ember.isEmpty(this.get('error'));
    }.property('error'),

    isInvalidToken: function() {
        return this.get('error') === '"invalid_token"';
    }.property('error')
});

WWWAuthenticateHeader.reopenClass({
    parse: function(xhr) {
        return WWWAuthenticateHeader.create({ rawHeader: xhr.getResponseHeader('WWW-Authenticate') });
    }
});

export default WWWAuthenticateHeader;
