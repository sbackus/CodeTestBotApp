import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

export default Ember.ArrayController.extend(UserAwareControllerMixin, {
    content: Ember.A(CHART_DATA)
    // sortPropertiesActive: ['createdAtDisplay:desc'],
    // sortPropertiesInactive: ['updatedAtDisplay:desc'],
    // sortAscending: false,

    // sortedActiveSubmissions: Ember.computed.sort('model', 'sortPropertiesActive'),
    // activeSubmissions: Ember.computed.filterBy('sortedActiveSubmissions', 'active', true),
    // sortedInactiveSubmissions: Ember.computed.sort('model', 'sortPropertiesInactive'),
    // inactiveSubmissions: Ember.computed.filterBy('sortedInactiveSubmissions', 'active', false),

    // actions: {
    //     confirmDelete: function(submission){
    //        return this.send('openModal', 'submission/confirm-delete', submission);
    //     },

    //     activeSortBy: function (sortPropertiesActive) {
    //         this.set('sortPropertiesActive', [sortPropertiesActive]);
    //     },

    //     inactiveSortBy: function (sortPropertiesInactive) {
    //         this.set('sortPropertiesInactive', [sortPropertiesInactive]);
    //     }
    // }
});

var CHART_DATA = [
    {  "letter":"A", "frequency":0.01492 },
    {  "letter":"B", "frequency":0.08167 },
    {  "letter":"C", "frequency":0.02780 },
    {  "letter":"D", "frequency":0.04253 },
    {  "letter":"E", "frequency":0.12702 },
    {  "letter":"F", "frequency":0.02288 },
    {  "letter":"G", "frequency":0.02022 },
    {  "letter":"H", "frequency":0.06094 },
    {  "letter":"I", "frequency":0.06973 },
    {  "letter":"J", "frequency":0.00153 },
    {  "letter":"K", "frequency":0.00747 }
  ];