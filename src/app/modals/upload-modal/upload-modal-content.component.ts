import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

export class UploadModalContent extends BSModalContext {
    constructor(public arrObjImgLIST: Object[], public nIndex: number, public objPostData: Object) {
        super();
    }
}
