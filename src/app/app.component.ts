import { Component, ChangeDetectorRef } from '@angular/core';
import { environment } from '../environments/environment';
import {
	Router,
	NavigationStart
} from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent{
	strCurrentPageName: string;
	arrStrPageListTargeted: string[];

	constructor(
		private _router: Router,
		private cdr: ChangeDetectorRef
	) {
		// console.log('environment: ');
		// console.log(environment);

		this.strCurrentPageName = '';
		this.arrStrPageListTargeted = ['estimate', 'more', 'welcome'];

		_router.events.subscribe((event) => {
			let strUrl = (event as any).url.toString();
			let arr = strUrl.split('/');
			arr.shift();
			if(arr.length > 0) {
				if(event instanceof NavigationStart) {
					this.strCurrentPageName = arr[0];
				}
			} else {
				console.log('The url is not correct.');
			}
			this.cdr.detectChanges();
		});
	}
}
