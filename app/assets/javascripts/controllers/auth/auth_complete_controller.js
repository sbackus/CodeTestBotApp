
CodeTestBotApp.AuthCompleteController = Em.Controller.extend({
    needs: ['application'],
    token: null,
    dataStoreBinding: 'controllers.application.dataStore',
    storeToken: function (sessionToken) {
        this.dataStore.setItem('sessionToken', sessionToken);
    }
});
