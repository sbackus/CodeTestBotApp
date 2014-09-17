import SubmissionsIndexControllerBase from 'code-test-bot-app/controllers/submissions/base';

function midnightToday() {
  return moment().hours(0).minutes(0).seconds(0).milliseconds(0);
}

function midnightTonight() {
  return midnightToday().add(1, 'days');
}

function midnightFiveBusinessDaysAgo() {
  var current = midnightToday();
  for (var i = 0; i < 5; i++) {
    current.subtract(1, 'days');
    while (current.isoWeekday() === 7 || current.isoWeekday() === 6) {
      current.subtract(1, 'days');
    }
  }
  return current;
}

var RecentlyClosedSubmissionsController = SubmissionsIndexControllerBase.extend({
  filterProperties: [
    ['active', false],
    ['updatedAt', function(filter, updatedAt) {
      var updatedTime = moment(updatedAt);
      return midnightFiveBusinessDaysAgo() <= updatedTime && updatedTime <= midnightTonight();
    }]
  ]
});

export default RecentlyClosedSubmissionsController;
