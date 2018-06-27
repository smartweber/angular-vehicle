import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

export class ConfirmModalContent extends BSModalContext {
    constructor(public carmapHandler: any, markId: number) {
        super();
    }
}
