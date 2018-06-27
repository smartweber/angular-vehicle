import { Component, OnInit }      from '@angular/core';
import { FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService }            from '../services/data.service';
import { StoreService }           from '../services/store.service';
import { SpinnerService }         from '../utilities/spinner/spinner.service';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

	nClaimID: number;
	strSlug: string;
	strAlertText: string;
	bIsAlert: boolean;
	contactForm: FormGroup;

	/**
	* Creates an instance of the HomeComponent
	*/
	constructor(
		private _dataService: DataService,
		private route: ActivatedRoute,
		private router: Router,
		private _spinner: SpinnerService,
		private _storeService: StoreService
	) {
		this.strSlug = '';
		this.bIsAlert = false;
	}

	/**
	* Get the names OnInit
	*/
	ngOnInit() {
		this.nClaimID = 194948;
		this.route.params.subscribe(params=> {
			this.strSlug = params['slugId'];
		});

		this.contactForm = new FormGroup({
			claim_id: new FormControl(null, [
				<any>Validators.required
			])
		});
	}

	next() {
		if(this.contactForm.valid && this.contactForm['value']['claim_id']) {
			this._spinner.start();
			let postData = {
				code: 200,
				data: {
					profile_slug: this.strSlug,
					Customer_Zip: 91701,
					ClaimID: this.contactForm['value']['claim_id']
				}
			};

			this._dataService.post('v1/data/getclaim', postData)
				.subscribe((res: any) => {
					// get the slug
					this._spinner.stop();

					if(res.code === 200) {
						this._storeService.setTempData(res.data);
						this._storeService.set('p_slug', res.data.slug);
						this.router.navigate(['/vehicle', res.data.slug]);
						this.bIsAlert = false;
					} else {
						this.bIsAlert = true;
						this.strAlertText = res.data.message;
					}
				}, (error: any) => {
					this._spinner.stop();
					console.error('Unable to fetch brands', error)
				});
		} else {
			this.bIsAlert = true;
			this.strAlertText = 'Please input the valid claim ID';
		}
	}

}
