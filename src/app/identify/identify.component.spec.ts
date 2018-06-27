import {
  async,
  TestBed
} from '@angular/core/testing';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http, HttpModule
} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {
  ActivatedRoute,
  Router,
  NavigationStart
} from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'angular2-select';
import { FileUploadModule } from 'ng2-file-upload';
import { IdentifyComponent } from './identify.component';
import { DotSliderComponent } from '../utilities/dot-slider/dot-slider.component';
import { DataService } from '../services/data.service';
import { EventService } from '../services/event.service';
import { SpinnerService } from '../utilities/spinner/spinner.service';
import { CaptureModalService } from '../modals/capture-modal/capture-modal.service';


describe('IdentifyComponent', () => {
  let fixture: any;
  let identifyInstance: IdentifyComponent;
  let mockDataService: MockDataService;
  let mockCaptureModalService: MockCaptureModalService;
  let objMockDataForDataService = {
    data: {
      steps: {
        totalStep: 3,
        currentStep: 1
      },
      liveHelp: {
        icon: 'http://icon.com/1.png',
        on: 1
      },
      help: {
        icon: 'http://help.com/1.png',
        on: 1,
        link: 'http://link.com'
      },
      ui: {
        icon: 'http://ui.com/1.png'
      },
      find: {
        on: 1,
        button: 'find_button'
      },
      manual:{
        on: 1,
        button: 'manual_button',
        callback: 'callback'
      },
      title: 'title',
      desc: 'description',
      img: 'http://img.com/1.png',
      button: 'button',
      callback: 'callback',
      slug: 'slug'
    }
  };

  let objGetMockDataForDataService = {
    data: {
      years: [
        {2001: 2001},
        {2002: 2002}
      ]
    }
  };

  let objMockCaptureModalData = {
    result: Promise.resolve(true)
  };

  beforeEach(async(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      declarations: [
        IdentifyComponent,
        DotSliderComponent
      ],
      providers: [
        SpinnerService,
        EventService,
        MODAL_PROVIDERS,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http, useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: CaptureModalService, useClass: MockCaptureModalService },
        { provide: DataService, useClass: MockDataService },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'slug' })
          }
        },
        {
          provide: Router,
          useClass: RouterStub
        }
      ],
      imports: [
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        FileUploadModule
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(IdentifyComponent);
      identifyInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnPostValue = objMockDataForDataService;
      spyOn(mockDataService, 'get').and.callThrough();
      mockDataService.returnGetValue = objGetMockDataForDataService;
      mockCaptureModalService = fixture.debugElement.injector.get(CaptureModalService) as MockCaptureModalService;
      spyOn(mockCaptureModalService, 'openDialog').and.callThrough();
      mockCaptureModalService.returnValue = objMockCaptureModalData;
    });
  }));

  it('#ngOnInit function should work with identify router', () => {
    identifyInstance.ngOnInit();
    fixture.detectChanges();
    expect(identifyInstance.strCurrentPageName).toEqual(identifyInstance.arrStrPages[0]);
  });

  it('#manageData function should work with getclaim callback', () => {
    let strSlug = 'slug';
    spyOn((<any>identifyInstance).router, 'navigate');
    identifyInstance.manageData({
      data: {
        slug: strSlug,
        callback: 'getclaim'
      }
    });
    expect((<any>identifyInstance).router.navigate).toHaveBeenCalledWith(['/vehicle', strSlug]);
  });

  it('#onYearsSelected function should work by selecting year select box', () => {
    // define the getVehicleForm
    identifyInstance.initForm();
    fixture.detectChanges();
    // wait for finishing all backend calls
    fixture.whenStable().then(() => {
      identifyInstance.arrYears = [{value: 2017, label: '2017'}];
      identifyInstance.getVehicleForm.setValue({
        year: 2017
      });
      fixture.detectChanges();
      expect(identifyInstance.getVehicleForm.get('make').disabled).toBeFalsy();
    });
  });

  it('#Get Vehicle Form should work', () => {
    // define the getvehcile form
    identifyInstance.initForm();
    identifyInstance.bIsPageLoading = true;
    identifyInstance.bIsVinModal = true;
    identifyInstance.nModalType= 0;
    identifyInstance.bIsYearsLoad = true;
    fixture.detectChanges();

     // wait for finishing all backend calls
    fixture.whenStable().then(() => {
      identifyInstance.arrYears = [{value: 2017, label: '2017'}];
      identifyInstance.getVehicleForm.setValue({
        year: 2017
      });
      fixture.detectChanges();

      // wait for finishing the make api call
      fixture.whenStable().then(() => {
        identifyInstance.arrMakes = [{value: 'make', label: 'make'}];
        identifyInstance.getVehicleForm.setValue({
          make: 'make'
        });
        fixture.detectChanges();

        // wait for finishing the model api call
        fixture.whenStable().then(() => {
          identifyInstance.arrModels = [{value: 'model', label: 'model'}];
          identifyInstance.getVehicleForm.setValue({
            model: 'model'
          });

          // wait for finishing the category api call
          fixture.whenStable().then(() => {
            identifyInstance.arrCategories = [{value: 'category', label: 'category'}];
            identifyInstance.getVehicleForm.setValue({
              category: 'category'
            });
            fixture.detectChanges();
            const buttonTrigger = fixture.debugElement.nativeElement.querySelector('.vin-form button');
            buttonTrigger.click();
            fixture.detectChanges();
            expect(identifyInstance.manageData).toHaveBeenCalled();
          });
        });
      });
    });
  });

  it('#goWithMiles function should work by clicking go button', () => {
    // define the getMilesForm
    fixture.detectChanges();
    identifyInstance.manualBtn(identifyInstance.arrStrMaualCallbacks[1]);
    fixture.detectChanges();

    // wait for finishing all backend calls
    fixture.whenStable().then(() => {
      identifyInstance.getMilesForm.setValue({
        mileage: 2
      });
      fixture.detectChanges();
      const buttonTrigger = fixture.debugElement.nativeElement.querySelector('.vin-form button');
      buttonTrigger.click();
      fixture.detectChanges();
      expect(identifyInstance.router.navigate).toHaveBeenCalledWith(['/vehicle', objMockDataForDataService.data.slug]);
    });
  });

  it('#goWithVin function should have vincode validation feature', () => {
    // define the getMilesForm
    fixture.detectChanges();
    identifyInstance.manualBtn(identifyInstance.arrStrMaualCallbacks[0]);
    fixture.detectChanges();

    // wait for finishing all backend calls
    fixture.whenStable().then(() => {
      identifyInstance.getMilesForm.setValue({
        vincode: 2
      });
      fixture.detectChanges();
      const buttonTrigger = fixture.debugElement.nativeElement.querySelector('.vin-form button');
      buttonTrigger.click();
      fixture.detectChanges();
      expect(identifyInstance.alertError).toHaveBeenCalled();
    });
  });
});

class MockDataService {
  returnPostValue: Object;
  returnGetValue: Object;

  post(url:string='', postdata: any={}): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnPostValue);
      observer.complete();
    });
  }

  get(url:string=''): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnGetValue);
      observer.complete();
    });
  }
}

class MockCaptureModalService {
  returnValue: Object;

  openDialog(uploader: any, viewContainer:any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}

class RouterStub {
  public url: string = '/identify/slug';
  private subject = new Subject();
  private events = this.subject.asObservable();

  navigate(url: string) {
    this.url = url;
    this.triggerNavEvents(url);
  }

  triggerNavEvents(url: string) {
    let ne = new NavigationStart(0, url);
    this.subject.next(ne);
  }
}