import Ember from 'ember';

var PaginatableMixin = Ember.Mixin.create({
  currentPage: 1,
  itemsPerPage: 5,

  pageRange: function() {
    return {
      start: (this.get('currentPage') - 1) * this.get('itemsPerPage'),
      end: this.get('currentPage') * this.get('itemsPerPage')
    };
  }.property('currentPage', 'itemsPerPage'),

  paginatedContent: function() {
    var range = this.get('pageRange');
    return this.get('arrangedContent').slice(range.start, range.end);
  }.property('arrangedContent.[]', 'pageRange'),

  pageCount: function() {
    var result = parseInt(this.get('content.length') / this.get('itemsPerPage'));
    if (this.get('content.length') % this.get('itemsPerPage') > 0) {
      result++;
    }

    return result;
  }.property('content.[]', 'itemsPerPage')
});

export default PaginatableMixin;
