import {
	Component,
	OnDestroy,

	ViewContainerRef
} from '@angular/core';
import { EventService }        from '../../services/event.service';
import { DataService }         from '../../services/data.service';
import { DisplayModalService } from '../../modals/display-modal/display-modal.service';
import { SpinnerService }      from '../spinner/spinner.service';

export interface IEventListenr extends OnDestroy {
    ngOnDestroy(): void;
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements IEventListenr, OnDestroy {

	bIsPageLoading: boolean;
	bIsHelp: boolean;
	bIsLiveHelp: boolean;
	bIsDropDown: boolean;

	strHelpIcon: string;
	strLiveHelpIcon: string;
	strLogoIcon: string;

	arrObjHelpLinks: Object[];

	constructor(
		private _dataService: DataService,
		private _eventService: EventService,
		private _displayModal: DisplayModalService,
		private _viewContainer: ViewContainerRef,
		private _spinner: SpinnerService
		) {
		this.bIsPageLoading = false;
		this.bIsDropDown = false;
		this.strLogoIcon = '';

		this._eventService.registerEvent('load_topbar_data', this, (args: any) => {
			let data = args[0];
			this.bIsHelp = data.helpStatus;
			this.bIsLiveHelp = data.liveHelpStatus;
			this.strHelpIcon = data.helpIcon;
			this.strLiveHelpIcon = data.liveHelpIcon;
			this.strLogoIcon = data.logoIcon;
			this.arrObjHelpLinks = data.helpLink;
			let that = this;
			setTimeout(() => {
				that.bIsPageLoading = true;
			});
		});
	}

	ngOnDestroy() {
		this._eventService.unregisterEvent('load_topbar_data', this);

		if(this._displayModal) {
			this._displayModal.closeDialog();
		}
	}

	drop() {
		this.bIsDropDown = this.bIsDropDown ? false : true;
	}

	displayLink(link: string) {
		this._spinner.start();
		this.drop();
		this._dataService.get(link, false)
            .subscribe((res: any) => {
              if(res.status === 200) {
              	this._spinner.stop();
              	this._displayModal.openDialog(res._body, this._viewContainer);
              }
            }, (error: any) => console.error('Unable to fetch brands', error));
	}

}
