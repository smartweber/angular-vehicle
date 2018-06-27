import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleComponent }       from './vehicle.component';
import { DataService }            from '../services/data.service';
import { EventService }           from '../services/event.service';
import { SpinnerService }         from '../utilities/spinner/spinner.service';
import { DotSliderComponent }     from '../utilities/dot-slider/dot-slider.component';
import { DisplayModalService }    from '../modals/display-modal/display-modal.service'; 

describe('VehicleComponent', () => {
  let fixture: any;
  let vehicleInstance: any;
  let mockDataService: any;
  let mockDisplayModalService: MockDisplayModalService;
  let mockData =  {
    data: {
      desc: 'description',
      steps: {
        totalStep: 3,
        currentStep:1
      },
      liveHelp: {
        icon: 'icon.png',
        on: 1
      },
      ui: {
        logo: 'logo.jpg'
      },
      help: {
        on: 1,
        link: 'http://link.com'
      }
    }
  };

  let objMockModalData = {
    result: Promise.resolve(true)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleComponent,
        DotSliderComponent
      ],
      providers: [
        EventService,
        SpinnerService,
        { provide: DataService, useClass: MockDataService },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'id' })
          }
        },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
        { provide: DisplayModalService, useClass: MockDisplayModalService }
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(VehicleComponent);
      vehicleInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnValue = mockData;

      mockDisplayModalService = fixture.debugElement.injector.get(DisplayModalService) as MockDisplayModalService;
      spyOn(mockDisplayModalService, 'openDialog').and.callThrough();
      mockDisplayModalService.returnValue = objMockModalData;
    });
  }));

  it('#ngOnInit function should work', () => {
    expect(vehicleInstance.bIsCheckPermission).toBeFalsy();
    spyOn(vehicleInstance, 'initVehicleData');
    spyOn(vehicleInstance, 'redirectWithPermissionIssue');
    vehicleInstance.ngOnInit();
    fixture.detectChanges();
    expect(vehicleInstance.initVehicleData).toHaveBeenCalled();
    expect(vehicleInstance.redirectWithPermissionIssue).toHaveBeenCalled();
    fixture.detectChanges();
    expect(vehicleInstance.bIsCheckPermission).toBeTruthy();
  });

  it('#redirectWithPermissionIssue function should work', () => {
    vehicleInstance.vehicleData = {
      message: vehicleInstance.PEMISSIONDENIED
    };
    vehicleInstance.redirectWithPermissionIssue();
    vehicleInstance._displayModal.openDialog(vehicleInstance.vehicleData.message, null)
      .then((dialog: any) => {
        (dialog as any).result.then((returnData: any) => {
          expect(vehicleInstance.router.navigate).toHaveBeenCalledWith(['/']);
        });
      });
  });

  it('#next function should be called by clicking next button', () => {
    spyOn(vehicleInstance, 'next');
    vehicleInstance.bIsCheckPermission = true;
    // wait for rendering the elements
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('.blue-btn-wrapper a.main-btn').click();
    expect(vehicleInstance.next).toHaveBeenCalled();
  });

  it('#next function should work', () => {
    vehicleInstance.strSlug = 'slug';
    vehicleInstance.next();
    expect(vehicleInstance.router.navigate).toHaveBeenCalledWith(['/damage', 'slug']);
  });

  it('#initVehicleData function should work', () => {
    expect(vehicleInstance.bIsPageLoading).toBeFalsy();
    spyOn((vehicleInstance as any)._eventService, 'emit');
    vehicleInstance.initVehicleData(mockData.data);
    expect(vehicleInstance._eventService.emit).toHaveBeenCalled();
    expect(vehicleInstance.bIsPageLoading).toBeTruthy();
  });
});

class MockDataService {

  returnValue: Object;

  post(url:string='', postdata: any={}): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}

class MockDisplayModalService {
  returnValue: Object;

  openDialog(strTitle: string, strImgUrl: string, objPostData: Object, viewContainer:any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return 1;
  }
}