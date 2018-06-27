import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { PlayerModalComponent } from './player-modal.component';
import { overlayConfigFactory, DialogRef } from 'ngx-modialog';

@Injectable()
export class PlayerModalService {
	dialog: DialogRef<BSModalContext>;

    constructor(public modal: Modal) {}

    openDialog(strImgURL: string, viewContainer:ViewContainerRef) {
    	(this.modal.overlay as any).defaultViewContainer = viewContainer;
        return this.modal.open(PlayerModalComponent, overlayConfigFactory({strImgURL: strImgURL}, BSModalContext))
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
