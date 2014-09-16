import SubmissionsIndexControllerBase from 'code-test-bot-app/controllers/submissions/base';
import PaginatableMixin from 'code-test-bot-app/mixins/paginatable';

var SubmissionsInactiveController = SubmissionsIndexControllerBase.extend(PaginatableMixin, {
    filterProperties: [['active', false]],
});

export default SubmissionsInactiveController;
