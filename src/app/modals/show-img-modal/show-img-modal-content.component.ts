import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

export class ShowImgModalContent extends BSModalContext {
    constructor(public strTitle: string, public strImgUrl: string, public objPostData: Object) {
        super();
    }
}
