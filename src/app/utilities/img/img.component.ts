import { Component,
  ElementRef,
  EventEmitter,
  Output,
  OnDestroy,
  Input,
  ViewContainerRef,
  OnInit } from '@angular/core';
import { Http }                from '@angular/http';
import { Modal }               from 'ngx-modialog/plugins/bootstrap';
import { environment }         from '../../../environments/environment';
import { DataService }         from '../../services/data.service';
import { EventService }        from '../../services/event.service';
import { StoreService }        from '../../services/store.service';
import { SpinnerService }      from '../../utilities/spinner/spinner.service';
import { UploadModalService }  from '../../modals/upload-modal/upload-modal.service';
import { ShowImgModalService } from '../../modals/show-img-modal/show-img-modal.service';
/**
 * This class represents the lazy loaded CarMapComponent.
 */

@Component({
	selector: 'image-location',
	templateUrl: './img.component.html',
	styleUrls: ['./img.component.css']
})

export class ImgComponent implements OnInit, OnDestroy {
	@Input('slugId') slugId: string;
	@Output() loadData = new EventEmitter();
	@Output() checkStep = new EventEmitter();

	strBackendApi: string;
	nSelectedItem: number;

	arrObjImgList: Object[];

	constructor(
		private http: Http,
		private el: ElementRef,
		private _dataService: DataService,
		private _eventService: EventService,
		private _spinner: SpinnerService,
		private _storeService: StoreService,
		private _uploadModalService: UploadModalService,
		private _showImgModalService: ShowImgModalService,
		private _viewContainer: ViewContainerRef,
		private modal: Modal
	) {
		this._spinner.start();
		this.arrObjImgList = [];
		this.strBackendApi = environment.API;
		this.nSelectedItem = -1;
	}

	ngOnInit() {
		this._eventService.registerEvent('uploaded_photo', this, (args: any) => {
	        this.checkNextStep();
		});
		let postData = {
			code: 200,
			data: {
				slug: this.slugId
			}
		};

		this._dataService.post('v1/data/photosrequested', postData)
			.subscribe((res: any) => {
				let data = res.data;
				let helpIcon = this.strBackendApi + data.help.icon;
				let liveHelpIcon = this.strBackendApi + data.liveHelp.icon;
				let logoIcon = this.strBackendApi + data.ui.logo;
				let helpStatus: boolean, liveHelpStatus: boolean;
				if(data.liveHelp.on === 1) {
					liveHelpStatus = true;
				} else {
					liveHelpStatus = false;
				}

				if(data.help.on === 1) {
					helpStatus = true;
				} else {
					helpStatus = false;
				}

				this._eventService.emit('load_topbar_data', {
					helpIcon: helpIcon,
					helpStatus: helpStatus,
					liveHelpIcon: liveHelpIcon,
					liveHelpStatus: liveHelpStatus,
					logoIcon: logoIcon,
					helpLink: data.help.link
				});

				this.loadData.emit({
					totalStep: data.steps.totalStep,
					currentStep: data.steps.currentStep
				});
				// get the slug
				this.arrObjImgList = res.data.photos.map((item: any) => {
					item.uploadedImgUrl = '';
					item.uploaded = false;
					item.uploadStatus = false;
					return item;
				});
				this.checkNextStep();

				this.slugId = res.data.slug;
				this._spinner.stop();
			}, (error: any) => console.error('Unable to fetch brands', error));
	}

	ngOnDestroy() {
		this._eventService.unregisterEvent('uploaded_photo', this);

		if(this._showImgModalService) {
			this._showImgModalService.closeDialog();
		}

		if(this._uploadModalService) {
			this._uploadModalService.closeDialog();
		}
	}

	checkNextStep() {
		let isNext = true;

		for(let i=0; i< this.arrObjImgList.length; i ++) {
			if((this.arrObjImgList[i] as any).required) {
				isNext = false;
				break;
			}
		}
		this.checkStep.emit(isNext);
	}

	openUploadModal(index: number) {
		this.nSelectedItem = index;
		let data = this.arrObjImgList[index];
		if(!data.hasOwnProperty('id')) {
			console.log('id property does not exist');
			return;
		}

		let postData = {
			code: 200,
			data: {
				slug: this.slugId,
				UserID: 0,
				PhotoID: (data as any).id
			}
		};

		if((data as any).uploaded) {
			let title = (data as any).text;
			let imgUrl = this.strBackendApi + (data as any).uploadedImgUrl;
			this._showImgModalService.openDialog(title, imgUrl, postData, this._viewContainer)
				.then((dialog: any) => {
					dialog.result.then((returnData: any) => {
						if((returnData as any).status) {
							(this.arrObjImgList[index] as any).uploadedImgUrl = (returnData as any).url;
						}
					});

				});
		} else {
			this._uploadModalService.openDialog(this.arrObjImgList, index, postData, this._viewContainer)
				.then(dialog => {
					dialog.result.then(returnData => {
						this.checkNextStep();
					});
				});
		}
	}
}
