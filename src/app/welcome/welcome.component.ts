import { Component,
	OnInit,
	OnDestroy,
	ViewContainerRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Modal }                  from 'ngx-modialog/plugins/bootstrap';
import { environment }            from '../../environments/environment';
import { DataService }            from '../services/data.service';
import { SpinnerService }         from '../utilities/spinner/spinner.service';
import { PlayerModalService }     from '../modals/player-modal/player-modal.service';


/**
 * This class represents the lazy loaded WelcomeComponent.
 */
@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {
	nPageHeight: number;
	bIsPageLoading: boolean;
	bIsVideoLink: boolean;

	strBackendApi: string;
	strSlugId: string;
	strWelcomeDescription: string;
	strBtnContent: string;
	strLogoUrl: string;
	strVideoLinkSrc: string;
	strVideoLink: string;
	strCallback: string;
	strVideoLinkText: string;

	constructor(
		private _dataService: DataService,
		private _spinner: SpinnerService,
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _playerModal: PlayerModalService,
		private _viewContainer: ViewContainerRef,
		private modal: Modal
	) {
		(modal.overlay as any).defaultViewContainer = _viewContainer;
		this.nPageHeight = window.innerHeight;
		this.strWelcomeDescription = '';
		this.strBtnContent = '';
		this.strLogoUrl = '';
		this.strCallback = '';
		this.strBackendApi = environment['API'];
		this.bIsVideoLink = false;
		this.bIsPageLoading = false;
	}

	ngOnInit() {
		this._activatedRoute.params.subscribe(params=> {
			this.strSlugId = params['slugId'];
			this.checkCurrentWindowWidth(this.strSlugId);
		});

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		    // is mobile..
		    let objMobileInfo = this.getDeviceInfo();
		    let postData = {
	        	code: 200,
	        	data: {
	        		slug: this.strSlugId,
	        		UserAgent_Device: objMobileInfo['os']['name'],
	        		UserAgent_Specific: 'v' + objMobileInfo['os']['version'],
	        	}
	        };

			this._dataService.post('v1/data/welcome', postData)
	        	.subscribe((res: any) => {
	        		console.log('Mobile info is successfully sent');
	        	}, (error: any) => console.error('Unable to fetch brands', error));
		}
	}

	checkCurrentWindowWidth(strSlug: string) {
		var width = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;

		if(width > 800) {
			this._router.navigate(['/emulator', strSlug]);
		} else {
			this.getWelcomeData();
		}
		// window.location.href = 'https://virtualevaluator.net/client/csl/';
	}

	getDeviceInfo() {
		let mobileModule = {
	        options: [],
	        header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor],
	        dataos: [
	            { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
	            { name: 'Windows', value: 'Win', version: 'NT' },
	            { name: 'iPhone', value: 'iPhone', version: 'OS' },
	            { name: 'iPad', value: 'iPad', version: 'OS' },
	            { name: 'Kindle', value: 'Silk', version: 'Silk' },
	            { name: 'Android', value: 'Android', version: 'Android' },
	            { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
	            { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
	            { name: 'Macintosh', value: 'Mac', version: 'OS X' },
	            { name: 'Linux', value: 'Linux', version: 'rv' },
	            { name: 'Palm', value: 'Palm', version: 'PalmOS' }
	        ],
	        databrowser: [
	            { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
	            { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
	            { name: 'Safari', value: 'Safari', version: 'Version' },
	            { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
	            { name: 'Opera', value: 'Opera', version: 'Opera' },
	            { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
	            { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
	        ],
	        init: function () {
	            var agent = this.header.join(' '),
	                os = this.matchItem(agent, this.dataos),
	                browser = this.matchItem(agent, this.databrowser);
	            
	            return { os: os, browser: browser };
	        },
	        matchItem: function (string, data) {
	            var i = 0,
	                j = 0,
	                html = '',
	                regex,
	                regexv,
	                match,
	                matches,
	                version;
	            
	            for (i = 0; i < data.length; i += 1) {
	                regex = new RegExp(data[i].value, 'i');
	                match = regex.test(string);
	                if (match) {
	                    regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
	                    matches = string.match(regexv);
	                    version = '';
	                    if (matches) { if (matches[1]) { matches = matches[1]; } }
	                    if (matches) {
	                        matches = matches.split(/[._]+/);
	                        for (j = 0; j < matches.length; j += 1) {
	                            if (j === 0) {
	                                version += matches[j] + '.';
	                            } else {
	                                version += matches[j];
	                            }
	                        }
	                    } else {
	                        version = '0';
	                    }
	                    return {
	                        name: data[i].name,
	                        version: parseFloat(version)
	                    };
	                }
	            }
	            return { name: 'unknown', version: 0 };
	        }
	    };

	    let mobileInfo = mobileModule.init();
	    return mobileInfo;
	}

	ngOnDestroy() {
		if(this._playerModal) {
			this._playerModal.closeDialog();
		}
	}

	getWelcomeData(nCounter: number = 0) {
		if(nCounter > 10) {
			console.log('Timeout to wait for the slug');
		} else {
			if(!this.strSlugId) {
				nCounter ++;
				setTimeout(() => this.getWelcomeData(nCounter), 30);
			} else {
				let postData = {
		        	code: 200,
		        	data: {
		        		slug: this.strSlugId
		        	}
		        };

				this._spinner.start();
				this._dataService.post('v1/data/welcome', postData)
		        	.subscribe((res: any) => {
		        		let data = res.data;

		        		if(data.forward) {
		        			window.location.href = data.forward;
		        		}

		        		this.strLogoUrl = this.strBackendApi + data.logo;
		        		this.strVideoLinkSrc = this.strBackendApi + data.video_link_src;
		        		this.strVideoLinkText = data.video_link_text;
		        		this.strWelcomeDescription = data.desc;
		        		this.strBtnContent = data.next_btn;
		        		this.strCallback = data.callback;
		        		this.strVideoLink = data.video_link;

		        		if(data.video === 0) {
		        			this.bIsVideoLink = false;
		        		} else {
		        			this.bIsVideoLink = true;
		        		}

		        		this.bIsPageLoading = true;
		        		this._spinner.stop();
		        	}, (error: any) => console.error('Unable to fetch brands', error));
			}
		}
	}

	start() {
		let subUrl = '';
		if(this.strCallback === 'vin_photo') {
			subUrl = 'identify';
		} else {
			subUrl = '/' + this.strCallback;
		}
		this._router.navigate([subUrl, this.strSlugId]);
	}

	player() {
		this._playerModal.openDialog('', this._viewContainer);
	}
}

