import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { DisplayModalComponent } from './display-modal.component';
import { overlayConfigFactory, DialogRef } from 'ngx-modialog';

@Injectable()
export class DisplayModalService {
	dialog: DialogRef<BSModalContext>;

    constructor(public modal: Modal) {}

    openDialog(strHtml: string, viewContainer:ViewContainerRef) {
    	(this.modal.overlay as any).defaultViewContainer = viewContainer;
        return this.modal.open(DisplayModalComponent, overlayConfigFactory({strHtml: strHtml}, BSModalContext))
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
