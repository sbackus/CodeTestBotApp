export default DS.Model.extend({
    text: DS.attr('string'),
    candidates: DS.hasMany('candidate')
});

