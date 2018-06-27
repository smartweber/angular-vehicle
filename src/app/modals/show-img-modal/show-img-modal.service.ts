import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { ShowImgModalComponent } from './show-img-modal.component';
import { overlayConfigFactory, DialogRef } from 'ngx-modialog';

@Injectable()
export class ShowImgModalService {
	dialog: DialogRef<BSModalContext>;

    constructor(public modal: Modal) {}

    openDialog(strTitle: string, strImgUrl: string, objPostData: Object, viewContainer:ViewContainerRef) {
    	(this.modal.overlay as any).defaultViewContainer = viewContainer;
        return this.modal.open(ShowImgModalComponent, overlayConfigFactory({
        	strTitle: strTitle,
        	strImgUrl: strImgUrl,
        	objPostData: objPostData
        }, BSModalContext))
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
