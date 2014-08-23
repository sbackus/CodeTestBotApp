import SubmissionsIndexControllerBase from 'code-test-bot-app/controllers/submissions/base';

var SubmissionsActiveController = SubmissionsIndexControllerBase.extend({
    filterProperties: [['active', true]],
});

export default SubmissionsActiveController;
