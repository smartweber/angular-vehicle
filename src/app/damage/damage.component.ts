import { Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService }     from '../modals/alert-modal/alert-modal.service';
import { QuestionsModalService } from '../modals/questions-modal/questions-modal.service';
import { environment }           from '../../environments/environment';
import { DataService }           from '../services/data.service';
import { EventService }          from '../services/event.service';
import { SpinnerService }        from '../utilities/spinner/spinner.service';

/**
 * This class represents the lazy loaded DamageComponent.
 */

@Component({
	selector: 'app-damage',
	templateUrl: './damage.component.html',
	styleUrls: ['./damage.component.css']
})

export class DamageComponent implements OnInit, OnDestroy {
	strSlug: string;
	strBtnDesc: string;
	strBackendApi: string;

	sub: any;
	mapData: any;

	bIsNext: boolean;
	bIsLoading: boolean;
	bIsSeverity: boolean;
	bIsStart: boolean;

	nTotoalStep: number;
	nCurrentStep: number;
	@Input('product') product: any;
	@ViewChild('nextAreaElement') nextAreaElement: any;

	constructor(
		private activeRoute: ActivatedRoute,
		private router: Router,
		private _eventService: EventService,
		private _viewContainer: ViewContainerRef,
		private _alertModalService: AlertModalService,
		private _questionsModalService: QuestionsModalService,
		private _dataService: DataService,
		private _spinnerService: SpinnerService
	) {
		this.bIsNext = false;
		this.bIsLoading = false;
		this.bIsSeverity = false;
		this.bIsStart = false;
	}

	ngOnInit() {
		this.strBackendApi = environment.API;
		// activeRoute param
		this.sub = this.activeRoute.params.subscribe(params=> {
			this.strSlug = params['slugId'];
			this.loadData('exterior');
		});
	}

	ngOnDestroy() {
		if(this.sub) {
			this.sub.unsubscribe();
		}

		if(this._alertModalService) {
			this._alertModalService.closeDialog();
		}

		if(this._questionsModalService) {
			this._questionsModalService.closeDialog();
		}
	}

	loadData(strLocation: string) {
		this._spinnerService.start();
		let postData = {
			code: 200,
			data: {
				slug: this.strSlug,
				call: 'preDamage'
			}
		};

		this._dataService.post('v1/data/question', postData)
			.subscribe((res: any) => {
				this._spinnerService.stop();

				if(res.hasOwnProperty('question') && res['question'].length > 0 && res['numbersOfQuestions'] > 0) {
					this._questionsModalService.openDialog(res, 'preDamage', this._viewContainer)
						.then((dialog: any) => {
							(dialog as any).result.then((returnData: any) => {
								this.getDataFromApi(strLocation);
							});
						});
				} else {
					this.getDataFromApi(strLocation);
				}
			}, (error: any) => console.error('Unable to fetch brands', error));
	}

	getDataFromApi(strLocation: string) {
		let postData = {
			code: 200,
			data: {
				slug: this.strSlug,
				location: strLocation
			}
		};

		this._dataService.post('v1/data/birdseyeauto', postData)
			.subscribe((res: any) => {
				this.mapData = res;
				if(!this.bIsStart) {
					this._alertModalService.openDialog(0, res, this._viewContainer);
				}

				this.nTotoalStep = res.data.steps.totalStep;
				this.nCurrentStep = res.data.steps.currentStep;
				let helpIcon = this.strBackendApi + res.data.help.icon;
				let liveHelpIcon = this.strBackendApi + res.data.liveHelp.icon;
				let logoIcon = this.strBackendApi + res.data.ui.logo;
				let helpStatus: boolean, liveHelpStatus: boolean;
				if(res.data.liveHelp.on === 1) {
					liveHelpStatus = true;
				} else {
					liveHelpStatus = false;
				}

				if(res.data.help.on === 1) {
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
					helpLink: res.data.help.link
				});
				this.bIsLoading = true;
			}, (error: any) => console.error('Unable to fetch brands', error));
	}

	eventChangeLocation(event: any) {
		this.bIsStart = true;
		this.bIsLoading = false;
		this.loadData(event);
	}

	checkNextAbility($event: any) {
		if ($event) {
			this._alertModalService.openDialog(1, this.mapData, this._viewContainer);
			this.bIsNext = true;
			this.bIsSeverity = false;
		}
	}

	initEventData(event: boolean) {
		this.waitNextArea(event);
	}

	waitNextArea(isAvailable: boolean, nCount: number = 0) {
		if(nCount > 50) {
			console.log('Time out to wait the next area in the damage page.');
		} else if(!this.nextAreaElement) {
			nCount ++;
			setTimeout(() => this.waitNextArea(isAvailable, nCount), 100);
		} else {
			this.bIsNext = isAvailable;
		}
	}

	next() {
		this._spinnerService.start();
		let postData = {
			code: 200,
			data: {
				slug: this.strSlug,
				call: 'postDamage'
			}
		};

		this._dataService.post('v1/data/question', postData)
			.subscribe((res: any) => {
				this._spinnerService.stop();

				if(res.hasOwnProperty('question') && res['question'].length > 0 && res['numbersOfQuestions'] > 0) {
					this._questionsModalService.openDialog(res, 'postDamage', this._viewContainer)
						.then((dialog: any) => {
							(dialog as any).result.then((returnData: any) => {
								this.router.navigate(['/photo', this.strSlug]);
							});
						});
				} else {
					this.router.navigate(['/photo', this.strSlug]);
				}
			}, (error: any) => console.error('Unable to fetch brands', error));
	}

	showNextSeverity(event: any) {
		this.bIsSeverity = (event as any)['status'];
		if(this.bIsSeverity) {
			this.strBtnDesc = `${(event as any)['desc']} (${(event as any)['side']})`;
		}
	}

	onNextSeverity() {
		this._eventService.emit('next_severity_event');
	}
}
