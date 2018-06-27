import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { overlayConfigFactory, DialogRef } from 'ngx-modialog';
import { ConfirmModalComponent } from './confirm-modal.component';

@Injectable()
export class ConfirmModalService {
	dialog: DialogRef<BSModalContext>;

    constructor(public modal: Modal) {}

    openDialog(carmapHandler: any, markId: number, viewContainer: ViewContainerRef) {
    	(this.modal.overlay as any).defaultViewContainer = viewContainer;
    	return this.modal.open(ConfirmModalComponent,  overlayConfigFactory({ carmapHandler: carmapHandler,
    		markId: markId}, BSModalContext))
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
