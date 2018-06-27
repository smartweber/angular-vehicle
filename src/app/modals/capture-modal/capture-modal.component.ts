import {
    Component,
    ElementRef,
    ViewChild,
    Renderer,
    OnInit
}  from '@angular/core';
import { Router }                    from '@angular/router';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { CaptureModalContent }       from './capture-modal-content.component';

@Component({
    moduleId: module.id,
    selector: 'modal-content',
    templateUrl: 'capture-modal.component.html',
    styleUrls: ['capture-modal.component.css']
})
export class CaptureModalComponent implements ModalComponent<CaptureModalContent>, OnInit {
    context: CaptureModalContent;
    arrStrSTATUSES: string[];
    strCurrentStatus: string;
    strResult: string;

    bIsSuccessResult: boolean;
    @ViewChild('fileProgress') fileProgress: ElementRef;

    constructor(public dialog: DialogRef<CaptureModalContent>,
        public renderer: Renderer,
        private router: Router) {
        this.arrStrSTATUSES =  ['uploading', 'done'];
        this.bIsSuccessResult = false;
        this.strCurrentStatus = this.arrStrSTATUSES[0];
        this.context = dialog.context;
    }

    ngOnInit() {
        let uploader = this.context.uploader;

        uploader.onProgressAll = (progress: any) => {
            if(this.strCurrentStatus === this.arrStrSTATUSES[0]) {
                if(this.fileProgress) {console.log(11111111)
                    this.renderer.setElementStyle(this.fileProgress.nativeElement, 'width', progress + '%');
                } else {
                    console.log('The file progress bar element is not exsited.');
                }
            }
        };

        uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {
            res = JSON.parse(res);

            if(status === 500) {
                this.bIsSuccessResult = false;
                this.strResult = 'Fail to upload';
            } else {
                this.bIsSuccessResult = true;
                this.strResult = 'Success';
            }

            this.strCurrentStatus = this.arrStrSTATUSES[1];

            let that = this;
            setTimeout(() => {
                that.dialog.close(res);
            }, 1000);
        };
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
}
