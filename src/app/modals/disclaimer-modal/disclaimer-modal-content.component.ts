import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

export class DisclaimerModalContent extends BSModalContext {
    constructor(public disclaimerData: string) {
        super();
    }
}
