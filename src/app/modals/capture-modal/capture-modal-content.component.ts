import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

export class CaptureModalContent extends BSModalContext {
    constructor(public uploader: any) {
        super();
    }
}
