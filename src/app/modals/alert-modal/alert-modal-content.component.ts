import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

export class AlertModalContent extends BSModalContext {
    constructor(public nType: number, public alertData: any) {
        super();
    }
}
