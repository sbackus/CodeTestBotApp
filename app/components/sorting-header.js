import Ember from 'ember';

var SortingHeaderComponent = Ember.Component.extend({
    tagName: 'th',
    classNameBindings: ['isSorted:active', 'isAscending:asc', 'isDescending:desc'],

    isSorted: function() {
        if (this.get('sortProperties')) {
            return this.get('sortProperties')[0] === this.get('key');
        } else {
            return false;
        }
    }.property('sortProperties'),

    isAscending: Ember.computed.and('isSorted', 'sortAscending'),
    notIsAscending: Ember.computed.not('sortAscending'),
    isDescending: Ember.computed.and('isSorted', 'notIsAscending'),

    click: function() {
        this.sendAction('action', this.get('key'));
    }
});

export default SortingHeaderComponent;
