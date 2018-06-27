import { Component,
    OnInit,
    ElementRef } from '@angular/core';
import { DialogRef,
    ModalComponent } from 'ngx-modialog';
import { Router }            from '@angular/router';
import { AlertModalContent } from './alert-modal-content.component';
import { environment }       from '../../../environments/environment';
declare var $: any;

@Component({
    selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent implements ModalComponent<AlertModalContent>, OnInit {
    context: AlertModalContent;
    productId: any;
    modalType: boolean;
    strSlug: string;
    availableModalClass: string;
    strDescription: string;
    strImgUrl: string;
    strTitle: string;
    doneBtnObject: Object;
    moreBtnObject: Object;

    circleImgLeft: number;
    handImgLeft: number;

    constructor(public dialog: DialogRef<AlertModalContent>,
        private element: ElementRef,
        private router: Router) {
        this.context = dialog.context;
        if(dialog.context.nType === 0) {
            this.modalType = false;
            this.strDescription = this.context.alertData.data.popupIntro.description;
            this.strImgUrl = environment.API + this.context.alertData.data.popupIntro.image;
        } else {
            this.doneBtnObject = <any>{};
            this.moreBtnObject = <any>{};
            this.modalType = true;
            let moreDdamageData = this.context.alertData.data.popupMoreDamage;
            this.strTitle = moreDdamageData['title'];
            this.strDescription = moreDdamageData['description'];
            this.strSlug = this.context.alertData.slug;
            this.strImgUrl = environment.API + moreDdamageData.image;
            (this.doneBtnObject as any)['label'] = moreDdamageData['done_button']['button'];
            (this.doneBtnObject as any)['style'] = {
                color: moreDdamageData['done_button']['color'],
                background: moreDdamageData['done_button']['background_color']
            };
            (this.doneBtnObject as any)['on'] = moreDdamageData['done_button']['on'];

            (this.moreBtnObject as any)['label'] = moreDdamageData['more_button']['button'];
            (this.moreBtnObject as any)['style'] = {
                color: moreDdamageData['more_button']['color'],
                background: moreDdamageData['more_button']['background_color']
            };
            (this.moreBtnObject as any)['on'] = moreDdamageData['more_button']['on'];
        }
    }

    ngOnInit() {}

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    onCancel() {
        this.dialog.close();
    }

    next() {
        this.dialog.close();
        this.router.navigate(['/photo', this.strSlug]);
    }
}
