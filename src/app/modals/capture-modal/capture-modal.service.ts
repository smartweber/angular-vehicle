import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { CaptureModalComponent } from './capture-modal.component';
import { overlayConfigFactory, DialogRef } from 'ngx-modialog';

@Injectable()
export class CaptureModalService {
	dialog: DialogRef<BSModalContext>;

    constructor(public modal: Modal) {}

    openDialog(uploader: any, viewContainer:ViewContainerRef) {
    	(this.modal.overlay as any).defaultViewContainer = viewContainer;
        return this.modal.open(CaptureModalComponent, overlayConfigFactory({uploader: uploader}, BSModalContext))
        	.then((dialog: DialogRef<BSModalContext>) => {
				this.dialog = dialog;
				return dialog;
			})
			.catch(() => {
				this.destroyModal();
			});
    };

    closeDialog() {
    	if(this.dialog) {
    		this.dialog.close();
    	}
    }

    destroyModal () {
		if (this.dialog && this.dialog.overlay) {
			if((this.modal.overlay as any).defaultViewContainer) {
				(this.modal.overlay as any).defaultViewContainer.clear();
			}

			this.dialog = null;
		}
	}
}
