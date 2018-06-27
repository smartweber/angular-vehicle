import { Component, OnInit } from '@angular/core';
import {
	Router,
	ActivatedRoute
} from '@angular/router';
import {
	FormGroup,
	Validators,
	FormControl
} from '@angular/forms';
import { StoreService }   from '../services/store.service';
import { DataService }    from '../services/data.service';
import { SpinnerService } from '../utilities/spinner/spinner.service';

/**
 * This class represents the lazy loaded VehicleModelComponent.
 */
@Component({
	selector: 'app-vehicle-model',
	templateUrl: './vehicle-model.component.html',
	styleUrls: ['./vehicle-model.component.css']
})
export class VehicleModelComponent implements OnInit {
	sub: any;
	user: any;
	vincodeValue: any;

	nZipcode: number;
	nNextAvailable: number;
	nYearID: number;
	nMakeID: number;
	nModelID: number;
	nCategoryID: number;
	strSlug: string;
	strClaimErrorText: string;
	strVinErrorText: string;
	arrYears: any[];
	arrMakes: any[];
	arrModels: any[];
	arrCategories: any[];
	
	bIsPageLoading: boolean;
	bIsVinError: boolean;
	bIsClaimError: boolean;
	bIsVinPass: boolean;

	claimForm: FormGroup;
	vinForm: FormGroup;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private _dataService: DataService,
		private _storeService: StoreService,
		private _spinner: SpinnerService
	) {
		this.bIsPageLoading = false;
		this.bIsVinError = false;
		this.bIsClaimError = false;
		this.bIsVinPass = false;
		this.nNextAvailable = 0;
		this.nYearID       = -1;
	    this.nMakeID       = -1;
	    this.nModelID      = -1;
	    this.nCategoryID   = -1;
	}

	ngOnInit() {
		this._spinner.start();
        this._dataService.get('v1/vehicle/years')
			.subscribe((res: any) => {
				this.arrYears = [];
				if(res && res.data && res.data.years) {
					for(let key in res.data.years) {
						let value = parseInt(res.data.years[key]);
						this.arrYears.push({value: key, label: value});
					}

					this.arrYears.sort(function(a: any, b: any) {
						return parseInt(b.label) - parseInt(a.label);
					});
				}

				this.initForm();
				this._spinner.stop();
            	this.bIsPageLoading = true;
			}, (error: any) => console.error('Unable to fetch brands', error));

	    this.sub = this.route.params.subscribe(params=> {
	    	this.nZipcode = params['zipcode'];
	    	this.strSlug = params['slugId'];
	    });

	    this.user = {
	    	vincode: ''
	    };
	}

	initForm() {
		this.claimForm = new FormGroup({
			year: new FormControl({value: null, disabled: false}, [
				<any>Validators.required
			]),
			make: new FormControl({value: null, disabled: true}, [
				<any>Validators.required
			]),
			model: new FormControl({value: null, disabled: true}, [
				<any>Validators.required
			]),
			category: new FormControl({value: null, disabled: true}, [
				<any>Validators.required
			])
		});

		this.vinForm = new FormGroup({
			vincode: new FormControl(null, [
				<any>Validators.required,
				<any>Validators.minLength(17),
				<any>Validators.maxLength(17)
			])
		});
	}

	onYearsSelected(event: any) {
		if(this.nNextAvailable === 0) {
    		this.nNextAvailable = 1;
    	} else {
    		this.nNextAvailable = 2;
    	}

		let year = (event as any).value;
		this.arrMakes = [];
		this.arrModels = [];
		this.claimForm.get('make').disable();
		this.claimForm.get('model').disable();
		this.claimForm.get('category').disable();

		this.nYearID = year;
		if(year === -1) {
			this.claimForm.get('make').disable();
		} else {
			this._spinner.start();
			let strClaimUrl = 'v1/vehicle/makesfromdata?year=' + year;
			this._dataService.get(strClaimUrl)
				.subscribe((res: any) => {
					this.claimForm.get('make').enable();
					if (res.data instanceof Array) {
						this.arrMakes = res.data.map((item: any) => {
							return {value: item.make, label: item.make};
						});
					} else {
						console.log('The response data is no array in year select box');
					}

					this._spinner.stop();
				}, (error: any) => console.error('Unable to fetch brands', error));
		}
	}

	onMakesSelected(event: any) {
		let make = (event as any).value;
		this.arrModels = [];
		this.claimForm.get('model').disable();
		this.claimForm.get('category').disable();

		if(parseInt(make) === -1) {
			this.arrModels = [];
			this.nModelID = -1;
			this.claimForm.get('model').disable();
			this.claimForm.get('category').disable();
			return;
		}

		this._spinner.start();
		let strClaimUrl = 'v1/vehicle/modelsfromdata?year=' + this.nYearID;
		strClaimUrl += '&make=';
		strClaimUrl += make;
		this._dataService.get(strClaimUrl)
			.subscribe((res: any) => {
				if (res.data instanceof Array) {
					this.arrModels = res.data.map((item: any) => {
						return {value: item.model, label: item.model};
					});
				} else {
					console.log('The response data is no array in make select box');
				}

				this.nMakeID = make;
				this.claimForm.get('model').enable();
				this._spinner.stop();
			}, (error: any) => console.error('Unable to fetch brands', error));
	}

	onModelsSelected(event: any) {
		let model = (event as any).value;
		this.arrCategories = [];
		this.claimForm.get('category').disable();

		if(parseInt(model) === -1) {
			this.arrCategories = [];
			this.nCategoryID   = -1;
			this.claimForm.get('category').disable();
			return;
		}

		this._spinner.start();
		let strClaimUrl = 'v1/vehicle/stylesfromdata?year=' + this.nYearID;
		strClaimUrl += '&make=';
		strClaimUrl += this.nMakeID;
		strClaimUrl += '&model=';
		strClaimUrl += model;

		this._dataService.get(strClaimUrl)
			.subscribe((res: any) => {
				if (res.data instanceof Array) {
					this.arrCategories = res.data.map((item: any) => {
						return {value: item.vehicleId, label: item.style};
					});
				} else {
					console.log('The response data is no array in make select box');
				}

				this.nModelID = model;
				this.claimForm.get('category').enable();
				this._spinner.stop();
			}, (error: any) => console.error('Unable to fetch brands', error));
	}

	onCategoriesSelected(event: any) {
		let category = (event as any).value;

		if(parseInt(category) === -1) {
			return;
		}

		if(this.nNextAvailable === 0) {
    		this.nNextAvailable = 1;
    	} else {
    		this.nNextAvailable = 2;
    	}

		this.nCategoryID = category;
	}

	alertError(nFormType: number, strErrorText: string, nTime: number) {
		if(nFormType === 0) { // claim form
			this.bIsClaimError = true;
		    this.strClaimErrorText = strErrorText;
		    let that = this;
		    setTimeout(() => {that.bIsClaimError = false}, nTime);
		} else {
			this.bIsVinError = true;
		    this.strVinErrorText = strErrorText;
		    let that = this;
		    setTimeout(() => {that.bIsVinError = false}, nTime);
		}
	}

	keypressVin(value: any) {
		if((/^[a-zA-Z0-9]*$/.test(value)) === false) {
			this.bIsVinError = true;
			this.alertError(1, 'Vincode should be alphanumberic and length should be 17.', 3000);
			this.vinForm.reset();
			return;
		}

		if(value.toString().length === 17) {
			this._spinner.start();
	    	this._dataService.get('v1/vehicle/vin?vin=' + value)
				.subscribe((res: any) => {
					console.log(res);
					if(res.code === 200) {
						this.bIsVinPass = true;
					} else {
						this.bIsVinPass = false;
						this.bIsVinError = true;
						this.alertError(1, res.data.error, 3000);
					}
					this._spinner.stop();
				}, (error: any) => console.error('Unable to fetch brands', error));
		}
	}

	loadClaim() {
		if(!this.claimForm.valid) {
			this.alertError(0, 'Please select all the fields.', 3000);
		} else {
			this._spinner.start();
			let postData = {
				code: 200,
				data: {
					Customer_Zip: this.nZipcode,
			        AutoYear: this.claimForm['value']['year'],
			        AutoID: this.nCategoryID
				}
			};

			this._dataService.post('v1/data/createclaim', postData)
				.subscribe((res: any) => {
					this._storeService.set('p_slug', res.data.slug);
			        this._spinner.stop();
			        this.router.navigate(['/damage', res.data.slug]);
				}, (error: any) => {
					console.error('Unable to fetch brands', error);
					this._spinner.stop();
					this.alertError(0, 'The api does not work properly.', 3000);
				});
		}
	}
}
