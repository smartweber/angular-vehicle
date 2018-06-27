import { Component,
    ElementRef,
    OnInit,
    ViewChild,
    Renderer
}  from '@angular/core';
import { Router }                    from '@angular/router';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { FileUploader }              from 'ng2-file-upload';
import { environment }               from '../../../environments/environment';
import { EventService }              from '../../services/event.service';
import { UploadModalContent }        from './upload-modal-content.component';

@Component({
    selector: 'app-upload-modal',
	templateUrl: './upload-modal.component.html',
	styleUrls: ['./upload-modal.component.css']
})
export class UploadModalComponent implements ModalComponent<UploadModalContent>, OnInit {
    context: UploadModalContent;
    bIsSuccessResult: boolean;
    nCurrentUploadIndex: number;
    nUploadedCounter: number;
    strTitle: string;
    strImgURL: string;
    strCurrentStatus: string;
    strEndBtnString: string;
    strBackendApi: string;
    strDescription: string;

    arrStrStatuses: string[];
    arrsObjImgList: Object[];
    arrObjRequiredImgList: Object[];
    arrPostDataList: Object[];

    uploader: FileUploader;
    @ViewChild('fileUpload') fileUpload: ElementRef;
    @ViewChild('fileProgress') fileProgress: ElementRef;

    constructor(public dialog: DialogRef<UploadModalContent>,
        private _eventService: EventService,
        private renderer: Renderer,
        private router: Router) {
        this.context = dialog.context;
        this.strBackendApi = environment.API;
        let nSelectedImgIndex = this.context.nIndex;
        this.arrsObjImgList = this.context.arrObjImgLIST;
        this.arrObjRequiredImgList = [];
        this.arrObjRequiredImgList.push(this.arrsObjImgList[nSelectedImgIndex]);
        for(let i = 0; i < this.arrsObjImgList.length; i++) {
            if(i !== nSelectedImgIndex
                && !(this.arrsObjImgList[i] as any)['uploaded']
                && !(this.arrsObjImgList[i] as any)['uploadStatus']) {
                this.arrObjRequiredImgList.push(this.arrsObjImgList[i]);
            }
        }

        this.arrPostDataList = [];
        for(let i = 0; i < this.arrObjRequiredImgList.length; i++) {
            this.arrPostDataList[i] = {
                code: 200,
                data: {
                    PhotoID: (this.arrObjRequiredImgList[i] as any).id,
                    UserID: 0,
                    slug: (this.context.objPostData as any).data.slug
                }
            };
        }

        this.nCurrentUploadIndex = 0;
        this.nUploadedCounter = 0;

        this.changeInfo(this.nCurrentUploadIndex);

        this.arrStrStatuses = ['selecting', 'uploading', 'done'];
        this.strCurrentStatus = this.arrStrStatuses[0];
        this.bIsSuccessResult = false;
    }

    ngOnInit() {
        this.nCurrentUploadIndex = 0;
        this.uploader = new FileUploader({url: `${this.strBackendApi}/v1/data/fileupload`});

        this.uploader.onProgressAll = (progress: any) => {
            if(this.strCurrentStatus === this.arrStrStatuses[1]) {
                this.renderer.setElementStyle(this.fileProgress.nativeElement, 'width', progress + '%');
            }
        };

        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
            form.append('data', JSON.stringify(this.arrPostDataList[fileItem.fileIndex]));
        };

        this.uploader.onAfterAddingFile = (fileItem) => {
            fileItem.withCredentials = false;
            (fileItem as any).fileIndex = this.nCurrentUploadIndex;
            let counter = this.arrsObjImgList.indexOf(this.arrObjRequiredImgList[this.nCurrentUploadIndex]);
            (this.arrsObjImgList[counter] as any).uploadStatus = true;
            fileItem.upload();

            this.nCurrentUploadIndex ++;
            if(this.nCurrentUploadIndex < this.arrObjRequiredImgList.length) {
                this.changeInfo(this.nCurrentUploadIndex);
            } else {
                this.strCurrentStatus = this.arrStrStatuses[1];
            }
        };

        this.uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {
            let counter = this.arrsObjImgList.indexOf(this.arrObjRequiredImgList[item.fileIndex]);
            (this.arrsObjImgList[counter] as any).uploadStatus = false;
            this.nUploadedCounter ++;

            if(status === 500) {
                this.strCurrentStatus = this.arrStrStatuses[2];
                this.strEndBtnString = 'Fail to upload';
                this.bIsSuccessResult = false;
            } else {
                res = JSON.parse(res);
                (this.arrsObjImgList[counter] as any).required       = false;
                (this.arrsObjImgList[counter] as any).uploaded       = true;
                (this.arrsObjImgList[counter] as any).uploadedImgUrl = res.data.path;

                if(this.nUploadedCounter >= this.arrObjRequiredImgList.length) {
                    this.strCurrentStatus = this.arrStrStatuses[2];
                    this.strEndBtnString = 'Done!';
                    this.bIsSuccessResult = true;
                }

                this._eventService.emit('uploaded_photo');
            }
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

    changeInfo(index: number) {
        this.strTitle = (this.arrObjRequiredImgList[index] as any).text;
        this.strDescription = (this.arrObjRequiredImgList[index] as any).desc;
        this.strImgURL = this.strBackendApi + (this.arrObjRequiredImgList[index] as any).img;
    }
}
