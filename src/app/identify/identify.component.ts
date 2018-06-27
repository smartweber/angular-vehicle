import { Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ElementRef
} from '@angular/core';
import { FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader }           from 'ng2-file-upload';
import { environment }            from '../../environments/environment';
import { DataService }            from '../services/data.service';
import { EventService }           from '../services/event.service';
import { SpinnerService }         from '../utilities/spinner/spinner.service';
import { CaptureModalService }    from '../modals/capture-modal/capture-modal.service';

/**
 * This class represents the lazy loaded IdentifyComponent.
 */
@Component({
	selector: 'app-identify',
	templateUrl: './identify.component.html',
	styleUrls: ['./identify.component.css']
})

export class IdentifyComponent implements OnInit, OnDestroy {
  nTotoalStep: number;
  nCurrentStep: number;
  nYearID: number;
  nMakeID: number;
  nModelID: number;
  nCategoryID: number;
  nModalType: number; // 0: get vehicle, 1:get vin

  strHelpIcon: string;
  strLiveHelpIcon: string;
  strSlug: string;
  strBackendApi: string;
  strTitle: string;
  strDesc: string;
  strImg: string;
  strBtnName: string;
  strFindBtn: string;
  strManualBtn: string;
  strCurrentPageName: string;
  strCallback: string;
  strConfirmMsg: string;
  strConfirmValue: string;
  strErrorAlert: string;
  strManualBtnCallback: string;


  arrStrPages: string[];
  arrStrMaualCallbacks: string[];
  arrYears: any[];
  arrMakes: any[];
  arrModels: any[];
  arrCategories: any[];

  bIsHelpStatus: boolean;
  bIsLiveHelpStatus: boolean;
  bIsPageLoading: boolean;
  bIsFindBtn: boolean;
  bIsManualBtn: boolean;
  bIsTakePhoto: boolean;
  bIsVinModal: boolean;
  bIsVinErrorAlert: boolean;
  bIsYearsLoad: boolean;

  paramSub: any;

  @ViewChild('descElement') descElement: any;
  @ViewChild('takePhoto') takePhoto: ElementRef;
  uploader: FileUploader;

  getVehicleForm: FormGroup;
  getVinForm: FormGroup;
  getMilesForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private _dataService: DataService,
    private _eventService: EventService,
    public router: Router,
    private _spinner: SpinnerService,
    private _captureModal: CaptureModalService,
    private _viewContainer: ViewContainerRef) {

    this.strBackendApi = environment.API;
    this.nTotoalStep   = 0;
    this.nCurrentStep  = 0;
    this.nYearID       = -1;
    this.nMakeID       = -1;
    this.nModelID      = -1;
    this.nCategoryID   = -1;
    this.nModalType    = -1;

    this.arrStrPages      = ['identify', 'identify_retry', 'identify_odometer', 'confirm_odometer'];
    this.arrStrMaualCallbacks = ['manualVin', 'manualOdomter'];
    this.bIsTakePhoto        = false;
    this.bIsVinModal         = false;
    this.bIsVinErrorAlert    = false;
    this.bIsYearsLoad        = false;

    this.arrYears = [];
    this.arrMakes = [];
    this.arrModels = [];
    this.arrCategories = [];
  }

  getEventData(data: any) {
    this.nTotoalStep     = data.steps.totalStep;
    this.nCurrentStep    = data.steps.currentStep;
    this.strLiveHelpIcon = this.strBackendApi + data.liveHelp.icon;
    this.strHelpIcon     = this.strBackendApi + data.help.icon;
    let logoIcon         = this.strBackendApi + data.ui.logo;
    this.strTitle        = data.title;
    this.strDesc         = data.desc;
    this.strImg          = this.strBackendApi + data.img;
    this.strBtnName      = data.button;
    this.strCallback     = data.callback;

    if(this.strCurrentPageName === this.arrStrPages[0] || this.strCurrentPageName === this.arrStrPages[1]) {
      this.strBtnName = data.button;
      this.bIsTakePhoto = true;
    } else {
      if(data.take && data.take.on === 1) {
        this.strBtnName = data.take.button;
        this.bIsTakePhoto = true;
      } else {
        this.bIsTakePhoto = false;
      }
    }

    if(this.strCurrentPageName === this.arrStrPages[3]) {
      this.strConfirmMsg = data.message;
      this.strConfirmValue = data.miles;
    }

    if(data.liveHelp && data.liveHelp.on === 1) {
      this.bIsLiveHelpStatus = true;
    } else {
      this.bIsLiveHelpStatus = false;
    }

    if(data.help && data.help.on === 1) {
      this.bIsHelpStatus = true;
    } else {
      this.bIsHelpStatus = false;
    }

    if(data.find && data.find.on === 1) {
      this.bIsFindBtn = true;
      this.strFindBtn = data.find.button;
    } else {
      this.bIsFindBtn = false;
    }

    if(data.manual && data.manual.on === 1) {
      this.bIsManualBtn = true;
      this.strManualBtn = data.manual.button;
      this.strManualBtnCallback = data.manual.callback;
    } else {
      this.bIsManualBtn = false;
    }

    this._eventService.emit('load_topbar_data', {
      helpIcon:       this.strHelpIcon,
      helpStatus:     this.bIsHelpStatus,
      liveHelpIcon:   this.strLiveHelpIcon,
      liveHelpStatus: this.bIsLiveHelpStatus,
      logoIcon:       logoIcon,
      helpLink:       data.help.link
    });
    this.bIsPageLoading = true;
    this.loadDescElement();
    this._spinner.stop();
  }

  loadDescElement(nCount: number=0) {
    if(nCount > 50) {
      console.log('Timeout to load the desc element');
    } else if(!this.descElement) {
      nCount ++;
      setTimeout(() => this.loadDescElement(nCount), 100);
    } else {
      this.descElement.nativeElement.innerHTML = this.strDesc;

      let url = this.strBackendApi + '/v1/data/' + this.strCallback;
      let postData: Object;

      switch (this.strCurrentPageName) {
        case this.arrStrPages[0]:
          postData = {
            code: 200,
            data: {
              slug: this.strSlug,
              type: 'VIN'
            }
          };
          break;

        case this.arrStrPages[1]:
          postData = {
            code: 200,
            data: {
              slug: this.strSlug,
              type: 'VIN'
            }
          };
          break;

        case this.arrStrPages[2]:
          postData = {
            code: 200,
            data: {
              slug: this.strSlug,
              type: 'Odometer'
            }
          };
          break;

        case this.arrStrPages[3]:
          postData = {
            code: 200,
            data: {
              slug: this.strSlug,
              miles: this.strConfirmValue
            }
          };
          break;
      }

      this.uploader = new FileUploader({url: url});

      this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
        form.append('data', JSON.stringify(postData));
      };

      this.uploader.onAfterAddingFile = (fileItem) => {
        fileItem.withCredentials = false;
        fileItem.upload();
        this.openUploadProgressBar();
      };
    }
  }

  openUploadProgressBar() {
    this._captureModal.openDialog(this.uploader, this._viewContainer)
      .then((dialog: any) => {
        dialog.result.then((returnData: any) => {
          if(returnData) {
            if(returnData.code === 200) {
              this.manageData(returnData);
            } else {
              console.log('To take a photo is raised the error.');
            }
          }
        });
      });
  }

  initForm() {
    this.getVehicleForm = new FormGroup({
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
  }

  ngOnInit() {
    this.bIsPageLoading = false;
    this._spinner.start();
    this.paramSub = this.route.params.subscribe(params=> {
      this.strSlug = params['slugId'];
      this.strCurrentPageName = this.router.url.split('/')[1];
      let url: string;

      switch (this.strCurrentPageName) {
        case this.arrStrPages[0]:
          url = '/v1/data/requestvin';
          break;

        case this.arrStrPages[1]:
          url = '/v1/data/vinretry';
          break;

        case this.arrStrPages[2]:
          url = '/v1/data/requestodometer';
          break;

        case this.arrStrPages[3]:
          url = '/v1/data/confirmodometer';
          break;
      }

      this._spinner.start();
      let postData = {
        code: 200,
        data: {
          slug: this.strSlug
        }
      };

      this._dataService.post(url, postData)
        .subscribe((res: any) => {
          this.getEventData(res.data);
          this._spinner.stop();
        }, (error: any) => console.error('Unable to fetch brands', error));

    });

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

  ngOnDestroy() {
    if(this.paramSub) {
      this.paramSub.unsubscribe();
    }

    if(this._captureModal) {
      this._captureModal.closeDialog();
    }
  }

  manageData(res: any) {
    let that = this;

    switch (res.data.callback) {
      case 'vinretry':
        that.router.navigate([`/${this.arrStrPages[1]}`, res.data.slug]);
        break;

      case 'requestodometer':
        that.router.navigate([`/${this.arrStrPages[2]}`, res.data.slug]);
        break;

      case 'confirmodometer':
        that.router.navigate([`/${this.arrStrPages[3]}`, res.data.slug]);
        break;

      case 'getclaim':
        that.router.navigate(['/vehicle', res.data.slug]);
        break;
    }
  }

  confirmMileage() {
    this._spinner.start();
    let postData = {
      code: 200,
      data: {
        miles: this.strConfirmValue,
        slug: this.strSlug
      }
    };

    this._dataService.post('v1/data/confirmodometersubmit', postData)
      .subscribe((res: any) => {
        this._spinner.stop();
        this.manageData(res);
      }, (error: any) => {
        console.error('Unable to fetch brands', error);
        this._spinner.stop();
      });
  }

  findBtn() {
    this.bIsVinModal = this.bIsVinModal ? false : true;
    this.nModalType = 0;
  }

  onYearsSelected(event: any) {console.log('----focusing')
    let year = (event as any).value;
    this.arrMakes = [];
    this.arrModels = [];
    this.getVehicleForm.get('make').disable();
    this.getVehicleForm.get('model').disable();
    this.getVehicleForm.get('category').disable();

    this.nYearID = year;
    if(year === -1) {
      this.getVehicleForm.get('make').disable();
    } else {
      this._spinner.start();
      let strClaimUrl = 'v1/vehicle/makesfromdata?year=' + year;
      this._dataService.get(strClaimUrl)
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
    this.getVehicleForm.get('model').disable();
    this.getVehicleForm.get('category').disable();

    if(parseInt(make) === -1) {
      this.arrModels = [];
      this.nModelID = -1;
      this.getVehicleForm.get('model').disable();
      this.getVehicleForm.get('category').disable();
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
        this.getVehicleForm.get('model').enable();
        this._spinner.stop();
      }, (error: any) => console.error('Unable to fetch brands', error));
  }

  onModelsSelected(event: any) {
    let model = (event as any).value;
    this.arrCategories = [];
    this.getVehicleForm.get('category').disable();

    if(parseInt(model) === -1) {
      this.arrCategories = [];
      this.nCategoryID   = -1;
      this.getVehicleForm.get('category').disable();
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
      this.getVehicleForm.get('category').enable();
      this._spinner.stop();
    }, (error: any) => console.error('Unable to fetch brands', error));
  }

  onCategoriesSelected(event: any) {
    let category = (event as any).value;
    if(parseInt(category) === -1) {
      return;
    }
    this.nCategoryID = category;
  }

  alertError(text: string, time: number) {
    this.bIsVinErrorAlert = true;
    this.strErrorAlert = text;
    let that = this;
    setTimeout(() => { that.bIsVinErrorAlert = false; }, time);
  }

  showVehicle() {
    if(!this.getVehicleForm.valid) {
      this.alertError('Please select all the fields.', 3000);
    } else {
      this._spinner.start();
      let postData = {
        code: 200,
        data: {
          AutoYear: this.getVehicleForm['value']['year'],
          AutoID: this.nCategoryID,
          slug: this.strSlug
        }
      };

      this._dataService.post('v1/data/savevehicle', postData)
        .subscribe((res: any) => {
          this._spinner.stop();
          this.manageData(res);
        }, (error: any) => {
          console.error('Unable to fetch brands', error);
          this._spinner.stop();
        });
    }
  }

  manualBtn(strCallback: string) {
    if(strCallback === this.arrStrMaualCallbacks[0]) {
      this.nModalType = 1;
      this.getVinForm = new FormGroup({
        vincode: new FormControl(null, [
          <any>Validators.required,
          <any>Validators.minLength(17),
          <any>Validators.maxLength(17)
        ])
      });
    } else {
      this.nModalType = 2;
      this.getMilesForm = new FormGroup({
        mileage: new FormControl(null, [
          <any>Validators.required,
          <any>Validators.pattern('[0-9]*')
        ])
      });
    }

    this.bIsVinModal = true;

  }

  goWithMiles() {
    if(!this.getMilesForm.valid) {
      this.alertError('The mileage must be numberic.', 3000);
    } else {
      this._spinner.start();
      let postData = {
        code: 200,
        data: {
          miles: this.getMilesForm['value']['mileage'],
          slug: this.strSlug
        }
      };

      this._dataService.post('v1/data/confirmodometersubmit', postData)
        .subscribe((res: any) => {
          this._spinner.stop();
          this.router.navigate(['/vehicle', res.data.slug]);
        }, (error: any) => {
          console.error('Unable to fetch brands', error);
          this._spinner.stop();
        });
    }
  }

  goWithVin() {
    if(!this.getVinForm.valid || (/^[a-zA-Z0-9]*$/.test(this.getVinForm['value']['vincode'])) === false) {
      this.alertError('Vincode should be alphanumberic and length should be 17.', 3000);
    } else {
      this._spinner.start();
      let postData = {
        code: 200,
        data: {
          AutoVIN: this.getVinForm['value']['vincode'],
          slug: this.strSlug
        }
      };

      this._dataService.post('v1/data/savevehicle', postData)
        .subscribe((res: any) => {
          this._spinner.stop();
          this.manageData(res);
        }, (error: any) => {
          console.error('Unable to fetch brands', error);
          this._spinner.stop();
          this.alertError('This Vincode is invalid.', 3000);
        });
    }
  }

  onVin() {
    this.nModalType = 0;
  }

}
