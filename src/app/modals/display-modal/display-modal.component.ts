import {
	Component,
	ElementRef,
	ViewChild
}  from '@angular/core';
import { Router } from '@angular/router';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { DisplayModalContent } from './display-modal-content.component';

@Component({
  selector: 'app-display-modal',
  templateUrl: './display-modal.component.html',
  styleUrls: ['./display-modal.component.css']
})
export class DisplayModalComponent implements ModalComponent<DisplayModalContent> {

	context: DisplayModalContent;
	@ViewChild('displayElement') displayElement:ElementRef;
    strHtml: string;

    constructor(public dialog: DialogRef<DisplayModalContent>,
        private router: Router) {
        this.context = dialog.context;
        this.strHtml = this.context.strHtml;
        this.loadData();
    }

    loadData(counter: number = 0) {
        if(counter > 50) {
            console.log('Fail to load the display data');
        } else if(!this.displayElement) {
            counter ++;
            setTimeout(() => this.loadData(counter), 50);
        } else {
            this.displayElement.nativeElement.innerHTML = '';
            this.displayElement.nativeElement.insertAdjacentHTML('beforeend', this.strHtml);
        }
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    onCancel() {
        this.dialog.close();
    }

    gotoHome() {
        this.dialog.close();
        this.router.navigate(['/']);
    }

}
