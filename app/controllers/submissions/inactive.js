import SubmissionsIndexControllerBase from 'code-test-bot-app/controllers/submissions/base';

var SubmissionsInactiveController = SubmissionsIndexControllerBase.extend({
    filterProperties: [['active', false]],
});

export default SubmissionsInactiveController;
