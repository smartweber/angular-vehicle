import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { QuestionsModalComponent } from './questions-modal.component';
import { overlayConfigFactory, DialogRef } from 'ngx-modialog';

@Injectable()
export class QuestionsModalService {
	dialog: DialogRef<BSModalContext>;

    constructor(public modal: Modal) {}

    openDialog(objData: Object, strCall: string, viewContainer:ViewContainerRef) {
    	(this.modal.overlay as any).defaultViewContainer = viewContainer;

        return this.modal.open(QuestionsModalComponent, overlayConfigFactory({ objData: objData, strCall: strCall }, BSModalContext))
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
