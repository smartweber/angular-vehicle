import {
	Component,
	ViewContainerRef,
	OnInit,
	ViewChild,
	ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment }    from '../../environments/environment';
import { DataService }    from '../services/data.service';
import { StoreService }   from '../services/store.service';
import { EventService }   from '../services/event.service';
import { NavbarService }  from '../services/navbar.service';
import { SpinnerService } from '../utilities/spinner/spinner.service';

/**
 * This class represents the lazy loaded NextComponent.
 */
@Component({
	selector: 'app-next',
	templateUrl: './next.component.html',
	styleUrls: ['./next.component.css']
})
export class NextComponent implements OnInit {
	bIsPageLoading: boolean;
	estimateData: any;
	strBackendApi: string;
	strSlug: string;

	@ViewChild('bodyElement') bodyElement: ElementRef;

	constructor(
		private _dataService: DataService,
		private _storeService: StoreService,
		private activeRoute: ActivatedRoute,
		private _eventService: EventService,
		private _navbarService: NavbarService,
		private _viewContainer: ViewContainerRef,
		private _spinner: SpinnerService
	) {
		this.bIsPageLoading = false;
		this.strBackendApi = environment['API'];
		this._spinner.start();
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

			this._dataService.post('v1/estimate/next ', postData)
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

					this._storeService.setObject('load_topbar_data',{
						helpIcon: helpIcon,
						helpStatus: helpStatus,
						liveHelpIcon: liveHelpIcon,
						liveHelpStatus: liveHelpStatus,
						logoIcon: logoIcon,
						helpLink: data.help.link
					});

					let estimateDataUrl = res.data.estimateHtml;
					let actionButtons = res.data.action.btns;
					this._navbarService.setData(actionButtons);

					this._dataService.get(estimateDataUrl, false)
						.subscribe((res: any) => {
							this.estimateData = res._body;
							this.bIsPageLoading = true;
							this.renderNextBodyElement();
							this._spinner.stop();
						}, (error: any) => console.error('Unable to fetch brands', error));

			}, (error: any) => console.error('Unable to fetch brands', error));
		});
	}

	renderNextBodyElement(counter: number = 0) {
		if(counter > 50) {
			console.log('Fail to load the next body element.');
		} else if(!this.bodyElement) {
			counter ++;
			setTimeout(() => this.renderNextBodyElement(counter), 50);
		} else {
			this.bodyElement.nativeElement.innerHTML = '';
			this.bodyElement.nativeElement.insertAdjacentHTML('beforeend', this.estimateData);
		}
	}
}

