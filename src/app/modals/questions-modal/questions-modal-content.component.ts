import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

export class QuestionsModalContent extends BSModalContext {
    constructor(public objData: Object, public strCall: string) {
        super();
    }
}
