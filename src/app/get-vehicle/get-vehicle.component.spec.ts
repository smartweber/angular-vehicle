import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SelectModule } from 'angular2-select';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { GetVehicleComponent } from './get-vehicle.component';
import { EventService } from '../services/event.service';
import { StoreService } from '../services/store.service';
import { DataService } from '../services/data.service';
import { SpinnerService } from '../utilities/spinner/spinner.service';

describe('Get vehicle component', () => {
  const MODAL_PROVIDERS = [
    Modal,
    Overlay,
    { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
  ];
  let fixture: any;
  let getVehicleInstance: any;
  let mockDataService: any;
  let objMockPostData =  {
    data: {
      years: {
        1: 1,
        2: 2,
        3: 3
      },
      steps: {
        totalStep: 3,
        currentStep: 1
      },
      liveHelp: {
        icon: 'http://icon.png'
      },
      help: {
        icon: 'http://icon.png'
      },
      ui: {
        logo: 'http://icon.png'
      },
      slug: 'slug'
    }
  };

  let objMockGetData = {
    data: {
      years: [
        {2001: 2001},
        {2002: 2002}
      ]
    },
    code: 200
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule
      ],
      providers: [
        MODAL_PROVIDERS,
        EventService,
        SpinnerService,
        StoreService,
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'slug' })
          }
        },
        { provide: DataService, useValue: new MockDataService() },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ],
      declarations: [ GetVehicleComponent ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(GetVehicleComponent);
      getVehicleInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnPostValue = objMockPostData;
      spyOn(mockDataService, 'get').and.callThrough();
      mockDataService.returnGetValue = objMockGetData;
    });
  }));

  it('#ngOnInit function should work', () => {
    spyOn(getVehicleInstance, 'initVehicleData');
    fixture.detectChanges();
    expect(getVehicleInstance.initVehicleData).toHaveBeenCalled();
  });

  it('#initVehicleData function should work', () => {
    spyOn((getVehicleInstance as any)._eventService, 'emit');
    getVehicleInstance.initVehicleData(objMockPostData.data);
    expect((getVehicleInstance as any)._eventService.emit).toHaveBeenCalled();
  });

  it('#onYearsSelected function should work', () => {
    // define the getVehicleForm
    getVehicleInstance.initForm();
    fixture.detectChanges();
    getVehicleInstance.onYearsSelected({value: '2017'});
    fixture.detectChanges();
    expect(getVehicleInstance.getVehicleForm.get('make').disabled).toBeFalsy();
  });

  it('#keypressVin function should work with valid vincode', () => {
    getVehicleInstance.initForm();
    fixture.detectChanges();
    getVehicleInstance.keypressVin('WBAFR7C50CC815606');
    fixture.detectChanges();
    fixture.detectChanges();
    expect(getVehicleInstance.bIsVinAvailable).toBeTruthy();
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
