import { Component,
    OnInit,
    ElementRef,
    ViewChild,
    Renderer
}  from '@angular/core';
import { Router }                    from '@angular/router';
import { FileUploader }              from 'ng2-file-upload/ng2-file-upload';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { environment }               from '../../../environments/environment';
import { ShowImgModalContent }       from './show-img-modal-content.component';

@Component({
    selector: 'app-show-img-modal',
	templateUrl: './show-img-modal.component.html',
	styleUrls: ['./show-img-modal.component.css']
})
export class ShowImgModalComponent implements ModalComponent<ShowImgModalContent>, OnInit {
    context: ShowImgModalContent;
    strImgUrl: string;
    strTitle: string;
    strBackendApi: string;
    strCurrentStatus: string;
    strEndBtnString: string;
    strPhotoUrl: string;
    bIsSuccessResult: boolean;

    arrStrStatus: string[];

    uploader: FileUploader;
    @ViewChild('fileUpload') fileUpload: ElementRef;
    @ViewChild('fileProgress') fileProgress: ElementRef;

    constructor(public dialog: DialogRef<ShowImgModalContent>,
        private renderer: Renderer,
        private router: Router) {
        this.arrStrStatus = ['selecting', 'uploading', 'done'];

        this.context = dialog.context;
        this.strImgUrl = this.context.strImgUrl;
        this.strTitle = this.context.strTitle;

        this.bIsSuccessResult = false;
        this.strCurrentStatus = this.arrStrStatus[0];
        this.strBackendApi = environment.API;
    }

    ngOnInit() {
        this.uploader = new FileUploader({url: `${this.strBackendApi}/v1/data/fileupload`});
        this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };

        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
            form.append('data', JSON.stringify(this.context.objPostData));
        };

        this.uploader.onProgressItem = (fileItem: any, progress: any) => {
            if(this.strCurrentStatus === this.arrStrStatus[1]) {
                this.renderer.setElementStyle(this.fileProgress.nativeElement, 'width', progress + '%');
            }
        };

        this.uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {
            this.strCurrentStatus = this.arrStrStatus[2];

            if(status === 500) {
                this.strEndBtnString = 'Fail to upload';
                this.bIsSuccessResult = false;
                this.strPhotoUrl = null;
            } else {
                res = JSON.parse(res);
                this.strPhotoUrl = res.data.path;
                this.strEndBtnString = 'Done!';
                this.bIsSuccessResult = true;
            }
        };

        this.uploader.onAfterAddingFile = (fileItem) => {
            fileItem.withCredentials = false;
            fileItem.upload();
            this.strCurrentStatus = this.arrStrStatus[1];
        };
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    onClose() {
        this.dialog.close({status: true, url: this.strPhotoUrl});
    }

    onCancel() {
        this.dialog.close({status: false});
    }
}

