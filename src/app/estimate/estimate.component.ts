import {
	Component,
	ViewContainerRef,
	ViewChild,
	ElementRef,
	OnInit,
	OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal }                  from 'ngx-modialog/plugins/bootstrap';
import { environment }            from '../../environments/environment';
import { DisclaimerModalService } from '../modals/disclaimer-modal/disclaimer-modal.service';
import { DataService }            from '../services/data.service';
import { StoreService }           from '../services/store.service';
import { EventService }           from '../services/event.service';
import { NavbarService }          from '../services/navbar.service';
import { SpinnerService }         from '../utilities/spinner/spinner.service';



/**
 * This class represents the lazy loaded EstimateComponent.
 */
@Component({
	selector: 'app-estimate',
	templateUrl: './estimate.component.html',
	styleUrls: ['./estimate.component.css']
})
export class EstimateComponent implements OnInit, OnDestroy {
	strEstimateData: string;
	strSlug: string;
	backendApi: string;
	bIsLoading: boolean;
	bIsDotSlider: boolean;
	bIsButtons: boolean;
	nTotalStep: number;
	nCurrentStep: number;

	@ViewChild('displayElement') displayElement: ElementRef;

	constructor(
		private _dataService: DataService,
		private _storeService: StoreService,
		private activeRoute: ActivatedRoute,
		private _eventService: EventService,
		private _router: Router,
		private _navbarService: NavbarService,
		private _viewContainer: ViewContainerRef,
		private _disclaimerModal: DisclaimerModalService,
		private _spinner: SpinnerService,
		private modal: Modal
	) {
		this.bIsLoading = false;
		this.bIsDotSlider = false;
		this.bIsButtons = false;
		this.strEstimateData = '';
		this._spinner.start();
		this.backendApi = environment.API;
	}

	ngOnInit() {
		// activeRoute param
		this.activeRoute.params.subscribe(params=> {
			this.strSlug = params['slugId'];
			this._storeService.set('slugID', this.strSlug);
			let postData = {
				code: 200,
				data: {
					slug: this.strSlug
				}
			};

			this._dataService.post('v1/estimate/estimate ', postData)
			.subscribe((res: any) => {
				let data = res.data;

				if(data.steps) {
					this.bIsDotSlider = true;
				} else {
					this.bIsDotSlider = false;
				}
				let helpIcon = this.backendApi + data.help.icon;
				let liveHelpIcon = this.backendApi + data.liveHelp.icon;
				let logoIcon = this.backendApi + data.ui.logo;
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

				if(data.hasOwnProperty('action')) {
					this.bIsButtons = true;
				} else {
					this.bIsButtons = false;
				}

				this._eventService.emit('load_topbar_data', {
					helpIcon: helpIcon,
					helpStatus: helpStatus,
					liveHelpIcon: liveHelpIcon,
					liveHelpStatus: liveHelpStatus,
					logoIcon: logoIcon,
					helpLink: data.help.link
				});

				let estimateDataUrl = res.data.estimateHtml;
				let isShowEstimateModal = res.data.showDisclaimer;
				let strDisclaimer = res.data.disclaimer;

				this._dataService.get(estimateDataUrl, false)
				.subscribe((res: any) => {
					this.strEstimateData = res._body;
					this.init();
					this.bIsLoading = true;
					if(isShowEstimateModal) {
						this._disclaimerModal.openDialog(strDisclaimer, this._viewContainer);
					}
					this._spinner.stop();
				}, (error: any) => console.error('Unable to fetch brands', error));
			}, (error: any) => console.error('Unable to fetch brands', error));
		});
	}

	ngOnDestroy() {
		if(this._disclaimerModal) {
			this._disclaimerModal.closeDialog();
		}
	}

	init(counter: number = 0) {
		if(counter > 50) {
			console.log('Fail to load the estimate element.');
		} else if(!this.displayElement) {
			counter ++;
			setTimeout(() => this.init(counter), 50);
		} else {
			this.displayElement.nativeElement.innerHTML = '';
			this.displayElement.nativeElement.insertAdjacentHTML('beforeend', this.strEstimateData);
		}
	}

	next() {
		this._router.navigate(['/next', this.strSlug]);
	}
}
