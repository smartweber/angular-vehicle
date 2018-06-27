import {
	Component,
	ViewChild,
	ElementRef,
	OnInit
} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NavbarService } from '../../services/navbar.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	arrObjActionData: any[];
	bIsActionVisible: boolean;
	bIsMorePage: boolean;
	bIsNextPage: boolean;
	bIsDrop: boolean;

	nSelectedMoreIndex: number;

	strHost: string;
	strCurrentUrl: string;
	strSlug: string;

	@ViewChild('navbarApp') navbarApp: ElementRef;

	constructor(
		private _navbarService: NavbarService,
		private _storeService: StoreService,
		private _router: Router) {
		this.bIsActionVisible = false;
		this.bIsMorePage = false;
		this.bIsNextPage = false;
		this.bIsDrop = false;
		this.arrObjActionData = [];
		this.strHost = environment['API'];
		this.strSlug = this._storeService.get('slugID');
	}

	ngOnInit() {
		this.setActions(this._router.url);
		this._navbarService.getEvent().subscribe(data => {
			this.bIsActionVisible = true;
			this.arrObjActionData = data;
			for(let i=0; i<this.arrObjActionData.length;i++) {
				this.arrObjActionData[i].text = this.clearString(this.arrObjActionData[i].text);
			}
			this._storeService.setObject('action_data', this.arrObjActionData);
		});

		if(this._storeService.getObject('action_data')) {
			this.arrObjActionData = this._storeService.getObject('action_data');
		}
	}

	setActions(strCurrentUri: string) {
		this.strCurrentUrl = strCurrentUri;
		this.nSelectedMoreIndex = -1;
		let arr = strCurrentUri.split('/');
		arr.shift();
		let strCurrentPageName = '';

		if(arr.length > 0) {
			strCurrentPageName = arr[0];

			if(strCurrentPageName === 'next') {
				this.bIsNextPage = true;
			} else if(strCurrentPageName === 'more') {
				this.bIsMorePage = true;
	    		let moreIndex = this._storeService.get('current_more_index');
	    		this.nSelectedMoreIndex = parseInt(moreIndex);
			}
		} else {
			console.log('The url is not correct.');
		}
	}

	clearString(str: string) {
		if(str) {
			str = str.replace(/&quot;/g, '"');
		}
		return str;
	}

	next() {
	    this.bIsDrop = this.bIsDrop ? false : true;
	}

	moreAction(url: string, text: string, index: number) {
		this.nSelectedMoreIndex = index;
		this._storeService.set('current_more_index', index.toString());
		let link = this.strHost + url;
		this._storeService.set('more_aciton_text', text);
		this._storeService.set('more_aciton_link', link);
		this._storeService.set('back_aciton_link', this.strCurrentUrl);
		this._router.navigate(['/more', this.strSlug]);
		this.bIsDrop = false;
	}

	gotoEstimate() {
		this._router.navigate(['/estimate', this.strSlug]);
	}

	closeDrop(event: any) {
		if(this.bIsDrop && (event.target === this.navbarApp.nativeElement)) {
			this.bIsDrop = false;
		}
	}

}


