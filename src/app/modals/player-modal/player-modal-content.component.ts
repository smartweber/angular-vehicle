import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

export class PlayerModalContent extends BSModalContext {
    constructor(public strImgURL: string) {
        super();
    }
}
