import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { overlayConfigFactory, DialogRef } from 'ngx-modialog';
import { DamageModalComponent } from './damage-modal.component';

@Injectable()
export class DamageModalService {
	dialog: DialogRef<BSModalContext>;
	bClose: boolean;

    constructor(public modal: Modal) {
    }

    openDialog(autoPartID: number, carMap:any, viewContainer: ViewContainerRef) {
    	this.bClose = false;
    	(this.modal.overlay as any).defaultViewContainer = viewContainer;
        return this.modal.open(DamageModalComponent,  overlayConfigFactory({ autoPartID: autoPartID,
        	carMap: carMap}, BSModalContext))
        	.then((dialog: DialogRef<BSModalContext>) => {
				this.dialog = dialog;
				return dialog;
			})
			.then(() => {
				this.destroyModal();
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
			this.bClose = true;
		}
	}
}
