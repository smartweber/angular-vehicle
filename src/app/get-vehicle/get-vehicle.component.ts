import {
	Component,
	OnInit,
	ViewContainerRef
} from '@angular/core';
import { FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Modal }                  from 'ngx-modialog/plugins/bootstrap';
import { environment }            from '../../environments/environment';
import { DataService }            from '../services/data.service';
import { EventService }           from '../services/event.service';
import { StoreService }  		  from '../services/store.service';
import { SpinnerService }         from '../utilities/spinner/spinner.service';


/**
 * This class represents the lazy loaded VehicleModelComponent.
 */
@Component({
	selector: 'app-get-vehicle',
	templateUrl: './get-vehicle.component.html',
	styleUrls: ['./get-vehicle.component.css']
})
export class GetVehicleComponent implements OnInit {
	sub: any;
	user: any;
	vincodeValue: any;
	arrYears: any[];
	arrMakes: any[];
	arrModels: any[];
	arrCategories: any[];
	bIsVinAvailable: boolean;
	bIsVehicleError: boolean;
	bIsVinRequire: boolean;
	bIsVinError: boolean;
	bIsYearsLoad: boolean;
	bIsVinLoad: boolean;

	nClaimYearID: number;
	nClaimMakeID: number;
	nClaimModelID: number;
	nClaimCategoryID: number;
	nTotoalStep: number;
	nCurrentStep: number;
	nNextAvailable: number;

	strClaimUrl: string;
	strSlugId: string;
	strVinCode: string;
	strBackendApi: string;
	strVinErrorText: string;
	strVehicleErrorText: string;
	getVehicleForm: FormGroup;
	vinForm: FormGroup;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private _dataService: DataService,
		private _eventService: EventService,
		private _storeService: StoreService,
		private _spinner: SpinnerService,
		private modal: Modal,
		private vcRef: ViewContainerRef
    ) {
		(modal.overlay as any ).defaultViewContainer = vcRef;
		this.strBackendApi = environment.API;
		this.nNextAvailable = 0;
		this.bIsVinAvailable = false;
		this._spinner.start();
		this.nClaimYearID = -1;
		this.nClaimMakeID = -1;
		this.nClaimModelID = -1;
		this.nClaimCategoryID = -1;
		this.bIsVinRequire = false;
		this.bIsVinError = false;
		this.bIsVinAvailable = false;
		this.bIsYearsLoad = false;
		this.bIsVinLoad = false;

		this.arrYears = [];
		this.arrMakes = [];
		this.arrModels = [];
		this.arrCategories = [];
	}


	initVehicleData(data: any) {
		this.nTotoalStep = data.steps.totalStep;
		this.nCurrentStep = data.steps.currentStep;
		
		let strHelpIcon = this.strBackendApi + data.help.icon;
		let logoIcon = this.strBackendApi + data.ui.logo;
		let bIsHelpStatus = false;
		let bIsLiveHelpStatus = false;
		let strLiveHelpIcon = this.strBackendApi + data.liveHelp.icon;

		if(data.liveHelp.on === 1) {
			bIsLiveHelpStatus = true;
		} else {
			bIsLiveHelpStatus = false;
		}

		if(data.help.on === 1) {
			bIsHelpStatus = true;
		} else {
			bIsHelpStatus = false;
		}

		if(data.requireVIN === 1) {
			this.bIsVinRequire = true;
		} else {
			this.bIsVinRequire = false;
		}

		this._eventService.emit('load_topbar_data', {
			helpIcon: strHelpIcon,
			helpStatus: bIsHelpStatus,
			liveHelpIcon: strLiveHelpIcon,
			liveHelpStatus: bIsLiveHelpStatus,
			logoIcon: logoIcon,
			helpLink: data.help.link
		});

		this._spinner.stop();
	}

	initForm() {
		this.getVehicleForm = new FormGroup({
			year: new FormControl('', [
				<any>Validators.required
			]),
			make: new FormControl('', [
				<any>Validators.required
			]),
			model: new FormControl('', [
				<any>Validators.required
			]),
			category: new FormControl('', [
				<any>Validators.required
			])
		});

		this.getVehicleForm.get('make').disable();
	    this.getVehicleForm.get('model').disable();
	    this.getVehicleForm.get('category').disable();

		this.vinForm = new FormGroup({
			vincode: new FormControl(null, [
				<any>Validators.required,
				<any>Validators.minLength(17),
				<any>Validators.maxLength(17)
			])
		});

		this.bIsVinLoad = true;
	}

	ngOnInit() {
		this._spinner.start();
		this.sub = this.route.params.subscribe(params=> {
			this.strSlugId = params['slugId'];
		});

		this.user = {
			vincode: ''
		};

		let postData = {
			code: 200,
			data: {
				slug: this.strSlugId
			}
		};

		this._dataService.post('v1/data/getvehicle', postData)
			.subscribe((res: any) => {
				this.initVehicleData(res.data);
			}, (error: any) => console.error('Unable to fetch brands', error));

		this._dataService.get('v1/vehicle/years')
			.subscribe((res: any) => {
				this.arrYears = [];
				for(let key in res.data.years) {
					let value = parseInt(res.data.years[key]);
					this.arrYears.push({value: key, label: value});
				}

				this.arrYears.sort(function(a: any, b: any) {
					return parseInt(b.label) - parseInt(a.label);
				});

				this.bIsYearsLoad = true;
				this.initForm();
			}, (error: any) => console.error('Unable to fetch brands', error));
	}

	onYearsSelected(event: any) {
		let year = (event as any).value;
		this.arrMakes = [];
		this.arrModels = [];
		this.arrCategories = [];
		this.getVehicleForm.get('make').disable();
	    this.getVehicleForm.get('model').disable();
	    this.getVehicleForm.get('category').disable();
		this.nNextAvailable = 1;

		if(this.nNextAvailable === 3) {
			this.nNextAvailable = 2;
		} else {
			this.nNextAvailable = 1;
		}

		this.nClaimYearID = year;

		if(year === -1) {
			this.getVehicleForm.get('make').disable();
		} else {
			this._spinner.start();
			this.strClaimUrl = 'v1/vehicle/makesfromdata?year=' + year;
			this._dataService.get(this.strClaimUrl)
				.subscribe((res: any) => {
					this.getVehicleForm.get('make').enable();

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
		this.arrCategories = [];
		this.getVehicleForm.get('model').disable();
		this.getVehicleForm.get('category').disable();
		this.nNextAvailable = 1;

		if(parseInt(make) === -1) {
			this.arrModels = [];
			this.arrCategories = [];
			this.nClaimModelID = -1;
			this.nClaimCategoryID = -1;
			this.getVehicleForm.get('model').disable();
			this.getVehicleForm.get('category').disable();
			return;
		}
		this._spinner.start();
		this.strClaimUrl = 'v1/vehicle/modelsfromdata?year=' + this.nClaimYearID;
		this.strClaimUrl += '&make=';
		this.strClaimUrl += make;
		this._dataService.get(this.strClaimUrl)
			.subscribe((res: any) => {
				if (res.data instanceof Array) {
					this.arrModels = res.data.map((item: any) => {
						return {value: item.model, label: item.model};
					});
				} else {
					console.log('The response data is no array in make select box');
				}

				this.nClaimMakeID = make;
				this.getVehicleForm.get('model').enable();
				this._spinner.stop();
			}, (error: any) => console.error('Unable to fetch brands', error));
	}

	onModelsSelected(event: any) {
		let model = (event as any).value;
		this.arrCategories = [];
		this.getVehicleForm.get('category').disable();
		this.nNextAvailable = 1;

		if(parseInt(model) === -1) {
			this.arrCategories = [];
			this.nClaimCategoryID = -1;
			this.getVehicleForm.get('category').disable();
			return;
		}
		this._spinner.start();
		this.strClaimUrl = 'v1/vehicle/stylesfromdata?year=' + this.nClaimYearID;
		this.strClaimUrl += '&make=';
		this.strClaimUrl += this.nClaimMakeID;
		this.strClaimUrl += '&model=';
		this.strClaimUrl += model;
		this._dataService.get(this.strClaimUrl)
			.subscribe((res: any) => {
				if (res.data instanceof Array) {
					this.arrCategories = res.data.map((item: any) => {
						return {value: item.vehicleId, label: item.style};
					});
				} else {
					console.log('The response data is no array in make select box');
				}
				this.nClaimModelID = model;
				this.getVehicleForm.get('category').enable();
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
		this.nClaimCategoryID = category;
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
			this.strVinCode = value;
			this._dataService.get('v1/vehicle/vin?vin=' + value)
				.subscribe((res: any) => {
					this.getVehicleForm.get('make').enable();
					this.getVehicleForm.get('model').enable();
					this.getVehicleForm.get('category').enable();

					if(res.code===200) {
						this.bIsVinAvailable = true;

						this.nClaimCategoryID = res.data.vehicleId;
						this.nNextAvailable = 3;
						this.arrYears       = [{value: res.data.year, label: res.data.year}];
						this.arrMakes       = [{value: res.data.make, label: res.data.make}];
						this.arrModels      = [{value: res.data.model, label: res.data.model}];
						this.arrCategories  = [{value: res.data.style, label: res.data.style}];

						let that = this;

						setTimeout(() => {
							that.getVehicleForm.controls['year'].setValue(res.data.year);
							that.getVehicleForm.controls['make'].setValue(res.data.make);
							that.getVehicleForm.controls['model'].setValue(res.data.model);
							that.getVehicleForm.controls['category'].setValue(res.data.style);
						}, 200);
					} else {
						this.alertError(1, res.data.error, 3000);
					}

					this._spinner.stop();
				}, (error: any) => console.error('Unable to fetch brands', error));
		} else {
			this.bIsVinAvailable = false;
		}
	}

	alertError(nFormType: number, strErrorText: string, nTime: number) {
		if(nFormType === 0) { // vehicle form
			this.bIsVehicleError = true;
		    this.strVehicleErrorText = strErrorText;
		    let that = this;
		    setTimeout(() => {that.bIsVehicleError = false}, nTime);
		} else {
			this.bIsVinError = true;
		    this.strVinErrorText = strErrorText;
		    let that = this;
		    setTimeout(() => {that.bIsVinError = false}, nTime);
		}
	}

	loadClaim() {
		if(this.bIsVinRequire && !this.bIsVinAvailable) {
			this.alertError(0, 'Please enter a 17-digit VIN #', 3000);
			return;
		}

		this._spinner.start();
		let postData = {
			code: 200,
			data: {
				AutoVIN: this.strVinCode,
				AutoYear: this.getVehicleForm['value']['year'],
				AutoID: this.nClaimCategoryID,
				slug: this.strSlugId
			}
		};

		this._dataService.post('v1/data/savevehicle', postData)
			.subscribe((res: any) => {
				this._storeService.set('p_slug', res.data.slug);
				this._spinner.stop();
				this.router.navigate(['/damage', res.data.slug]);
			}, (error: any) => console.error('Unable to fetch brands', error));
	}

	onVin() {
		this.modal.alert()
			.size('sm')
			.showClose(true)
			.okBtnClass('hidden')
			.title('Vin Locations')
			.body(`
			<div class="vin-modal-wrapper no-padding">
			<img src="assets/img/vin_locations.png">
			</div>
			`)
			.open();
	}
}

