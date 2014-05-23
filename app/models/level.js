export default DS.Model.extend({
    text: DS.attr('string'),
    submissions: DS.hasMany('submission')
});

