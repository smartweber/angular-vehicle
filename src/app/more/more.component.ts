import {
	Component,
	OnInit
} from '@angular/core';
import { Router,
NavigationStart } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { StoreService } from '../services/store.service';
import { EventService } from '../services/event.service';

/**
 * This class represents the lazy loaded MoreComponent.
 */
@Component({
	selector: 'app-more',
	templateUrl: './more.component.html',
	styleUrls: ['./more.component.css']
})
export class MoreComponent implements OnInit {
	iframeLink: any;
	strTitle: string;

	constructor(
		private _router: Router,
		private _storeService: StoreService,
		private _eventService: EventService,
		private domSanitizer : DomSanitizer
	) {
	}

	ngOnInit() {
		this._router.events.subscribe(event => {
			if(event instanceof NavigationStart) {
				this.init();
			}
		});

		this.init();
	}

	init() {
		let link = this._storeService.get('more_aciton_link');
		this.strTitle = this._storeService.get('more_aciton_text');
		this.iframeLink = this.domSanitizer.bypassSecurityTrustResourceUrl(link);
		let toolbarData = this._storeService.getObject('load_topbar_data');
		if(toolbarData) {
			this._eventService.emit('load_topbar_data', toolbarData);
		}
	}
}
