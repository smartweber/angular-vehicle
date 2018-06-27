import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { DisclaimerModalComponent } from './disclaimer-modal.component';
import { overlayConfigFactory, DialogRef } from 'ngx-modialog';

@Injectable()
export class DisclaimerModalService {
	dialog: DialogRef<BSModalContext>;

    constructor(public modal: Modal) {}

    openDialog(disclaimerData: string, viewContainer:ViewContainerRef) {
    	(this.modal.overlay as any).defaultViewContainer = viewContainer;
        return this.modal.open(DisclaimerModalComponent, overlayConfigFactory({disclaimerData: disclaimerData}, BSModalContext))
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
