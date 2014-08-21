import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
    host: CodeTestBotAppENV.SERVER_HOST
});
