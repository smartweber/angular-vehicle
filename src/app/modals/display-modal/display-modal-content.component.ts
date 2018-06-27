import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

export class DisplayModalContent extends BSModalContext {
    constructor(public strHtml: string) {
        super();
    }
}
