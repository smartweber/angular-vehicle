import {
	Component,
	OnInit,
	OnDestroy,
	ViewContainerRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment }            from '../../environments/environment';
import { DataService }            from '../services/data.service';
import { EventService }           from '../services/event.service';
import { SpinnerService }         from '../utilities/spinner/spinner.service';
import { DisplayModalService }    from '../modals/display-modal/display-modal.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit, OnDestroy {
	nTotoalStep: number;
	nCurrentStep: number;

	strSlug: string;
	strHelpIcon: string;
	strLiveHelpIcon: string;
	strBackendApi: string;
	bIsHelpStatus: boolean;
	bIsLiveHelpStatus: boolean;
	bIsPageLoading: boolean;
	bIsCheckPermission: boolean;

	sub: any;

	vehicleData: Object;
	PEMISSIONDENIED = 'Permission denied.';

	constructor(
		private route: ActivatedRoute,
		private _dataService: DataService,
		private _eventService: EventService,
		private router: Router,
		private _spinner: SpinnerService,
		private _displayModal: DisplayModalService,
		private _viewContainer: ViewContainerRef
	) {
		this.strBackendApi = environment['API'];
		this.nTotoalStep = 0;
		this.nCurrentStep = 0;
		this.bIsPageLoading = false;
		this.bIsCheckPermission = false;
	}

	initVehicleData(data: any) {
		this.nTotoalStep = data.steps.totalStep;
		this.nCurrentStep = data.steps.currentStep;
		this.strLiveHelpIcon = this.strBackendApi + data.liveHelp.icon;
		this.strHelpIcon = this.strBackendApi + data.help.icon;
		let logoIcon = this.strBackendApi + data.ui.logo;

		if(data.liveHelp.on === 1) {
			this.bIsLiveHelpStatus = true;
		} else {
			this.bIsLiveHelpStatus = false;
		}

		if(data.help.on === 1) {
			this.bIsHelpStatus = true;
		} else {
			this.bIsHelpStatus = false;
		}

		this._eventService.emit('load_topbar_data', {
			helpIcon: this.strHelpIcon,
			helpStatus: this.bIsHelpStatus,
			liveHelpIcon: this.strLiveHelpIcon,
			liveHelpStatus: this.bIsLiveHelpStatus,
			logoIcon: logoIcon,
			helpLink: data.help.link
		});
		this.bIsPageLoading = true;
		this._spinner.stop();
	}

	ngOnInit() {
		this._spinner.start();
		this.sub = this.route.params.subscribe(params=> {
			this.strSlug = params['slugId'];
			this._spinner.start();
			let postData = {
				code: 200,
				data: {
					slug: this.strSlug
				}
			};

			this._dataService.post('v1/data/getclaim', postData)
				.subscribe((res: any) => {
					this.initVehicleData(res.data);
					this.vehicleData = res.data;
					this.redirectWithPermissionIssue();
					this.bIsCheckPermission = true;
					this._spinner.stop();
				}, (error: any) => console.error('Unable to fetch brands', error));

		});
	}

	ngOnDestroy() {
		if(this.sub) {
			this.sub.unsubscribe();
		}

		if(this._displayModal) {
			this._displayModal.closeDialog();
		}
	}

	redirectWithPermissionIssue() {
		if(this.vehicleData && (this.vehicleData as any).message === this.PEMISSIONDENIED) {
			this._displayModal.openDialog((this.vehicleData as any).message, this._viewContainer)
				.then((dialog: any) => {
					(dialog as any).result.then((returnData: any) => {
						this.router.navigate(['/']);
					});
				});
		}
	}

	//from vehicle to damage
	next() {
		this.router.navigate(['/damage', this.strSlug]);
	}

}
