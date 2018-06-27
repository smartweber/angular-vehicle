import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { UploadModalComponent } from './upload-modal.component';
import { overlayConfigFactory, DialogRef } from 'ngx-modialog';

@Injectable()
export class UploadModalService {
	dialog: DialogRef<BSModalContext>;

    constructor(public modal: Modal) {}

    openDialog(arrObjImgLIST: Object[], nIndex: number, objPostData: Object, viewContainer:ViewContainerRef) {
    	(this.modal.overlay as any).defaultViewContainer = viewContainer;
        return this.modal.open(UploadModalComponent, overlayConfigFactory(
        	{ arrObjImgLIST: arrObjImgLIST, nIndex: nIndex, objPostData: objPostData}, BSModalContext))
        	.then((dialog: DialogRef<BSModalContext>) => {
				this.dialog = dialog;
				return dialog;
			});
    };

    closeDialog() {
    	if(this.dialog) {
            this.dialog.close();
        }
    }
}
