import Ember from 'ember';

var PageNumbersComponent = Ember.Component.extend({
  currentPage: 1,
  pageCount: 0,
  itemsPerPage: 5,
  maxPagesToDisplay: 11,

  pageNumbers: function() {
    var currentPage = this.get('currentPage');
    var pageCount = this.get('pageCount');
    var maxPages = this.get('maxPagesToDisplay');
    maxPages += 1 - maxPages % 2;

    var pages = [];
    for (var index = 1; index <= this.get('pageCount'); index++) {
      pages.push({
        ellipses: false,
        page: index,
        current: currentPage === index
      });
    }

    if (pages.length > maxPages) {
      var currentPosition = ((maxPages - 1) / 2) + 1;
      if (currentPosition > currentPage) {
        currentPosition = currentPage;
      }

      if ((pageCount - currentPage) < (maxPages - currentPosition)) {
        currentPosition = maxPages - (pageCount - currentPage);
      }

      var maxDistance, overspill, toRemove, idx;
      if ((pageCount - currentPage) > (maxPages - currentPosition)) {
        maxDistance = maxPages - currentPosition;
        overspill = pageCount - currentPage - maxDistance;
        toRemove = overspill + 1;
        idx = pageCount - 1 - toRemove;
        pages.replace(idx, toRemove, [{ellipses: true}]);
      }

      if (currentPage > currentPosition) {
        overspill = currentPage - currentPosition;
        toRemove = overspill + 1;
        idx = 1;
        pages.replace(idx, toRemove, [{ellipses: true}]);
      }
    }

    return pages;
  }.property('currentPage', 'pageCount', 'maxPagesToDisplay'),

  hasNext: function() {
    return this.get('currentPage') < this.get('pageCount');
  }.property('currentPage', 'pageCount'),

  hasPrevious: function() {
    return this.get('currentPage') > 1;
  }.property('currentPage'),

  actions: {
    goToNextPage: function() {
      if (this.get('hasNext')) {
        this.incrementProperty('currentPage');
      }
    },
    goToPreviousPage: function() {
      if (this.get('hasPrevious')) {
        this.decrementProperty('currentPage');
      }
    },
    goToPage: function(page) {
      if (page >= 1 && page <= this.get('pageCount')) {
        this.set('currentPage', page);
      }
    }
  }
});

export default PageNumbersComponent;
