import {
  async,
  TestBed
} from '@angular/core/testing';
import { VehicleModelComponent } from './vehicle-model.component';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SelectModule } from 'angular2-select';
import { StoreService } from '../services/store.service';
import { DataService } from '../services/data.service';
import { SpinnerService } from '../utilities/spinner/spinner.service';

describe('VehicleModelComponent', () => {
  let fixture: any;
  let vehicleModelInstance: VehicleModelComponent;
  let mockDataService: any;
  let objMockPostData = {
    data: {
      slug: 'slug'
    }
  };

  let objMockGetData = {
    data: {
      years: [
        {2001: 2001},
        {2002: 2002}
      ]
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SelectModule
      ],
      providers: [
        SpinnerService,
        StoreService,
        { provide: DataService, useValue: new MockDataService() },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({
              slugId: 'slug',
              zipcode: 123
            })
          }
        }
      ],
      declarations: [
        VehicleModelComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(VehicleModelComponent);
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnPostValue = objMockPostData;
      spyOn(mockDataService, 'get').and.callThrough();
      mockDataService.returnGetValue = objMockGetData;
      vehicleModelInstance = fixture.debugElement.componentInstance;
    });
  }));

  it('#should get api data correctly when page is initial load', () => {
    spyOn((vehicleModelInstance as any)._spinner, 'start');
    expect(vehicleModelInstance.bIsPageLoading).toBeFalsy();
    vehicleModelInstance.ngOnInit()
    expect((vehicleModelInstance as any)._spinner.start).toHaveBeenCalled();
    fixture.detectChanges();
    expect(vehicleModelInstance.bIsPageLoading).toBeTruthy();
    expect(vehicleModelInstance.nZipcode).toEqual(123);
    expect(vehicleModelInstance.strSlug).toEqual('slug');
  });

  it('#claimForm and vinForm form should be defined by calling init function', () => {
    // define the claimForm
    vehicleModelInstance.initForm();
    expect(vehicleModelInstance.claimForm).toBeDefined();
    expect(vehicleModelInstance.vinForm).toBeDefined();
  });

  it('#onYearsSelected function should work', () => {
    // define the claimForm
    vehicleModelInstance.initForm();
    fixture.detectChanges();
    vehicleModelInstance.onYearsSelected({value: '2017'});
    fixture.detectChanges();
    expect(vehicleModelInstance.claimForm.get('make').disabled).toBeFalsy();
  });

  it('#keypressVin function should accept valid vincode', () => {
    vehicleModelInstance.initForm();
    fixture.detectChanges();
    spyOn((vehicleModelInstance as any).vinForm, 'reset');
    vehicleModelInstance.keypressVin('!');
    expect((vehicleModelInstance as any).vinForm.reset).toHaveBeenCalled();
  });

  it('#loadClaim function should work', () => {
    vehicleModelInstance.bIsPageLoading = true;
    vehicleModelInstance.initForm();
    fixture.detectChanges();

    vehicleModelInstance.arrYears = [{value: '2017', label: '2017'}];
    vehicleModelInstance.onYearsSelected({value: '2017'});
    fixture.detectChanges();
    vehicleModelInstance.claimForm.controls['year'].setValue('2017');

    fixture.whenStable().then(() => {
      vehicleModelInstance.arrMakes = [{value: 'make', label: 'make'}];
      vehicleModelInstance.onMakesSelected({value: 'make'});
      fixture.detectChanges();
      vehicleModelInstance.claimForm.controls['make'].setValue('make');

      fixture.whenStable().then(() => {
        vehicleModelInstance.arrModels = [{value: 'model', label: 'model'}];
        vehicleModelInstance.onModelsSelected({value: 'model'});
        vehicleModelInstance.claimForm.controls['model'].setValue('model');
        fixture.detectChanges();
        vehicleModelInstance.claimForm.controls['model'].setValue('model');

        fixture.whenStable().then(() => {
          vehicleModelInstance.arrCategories = [{value: 'category', label: 'category'}];
          vehicleModelInstance.onCategoriesSelected({value: 'category'});
          vehicleModelInstance.claimForm.controls['category'].setValue('category');
          fixture.detectChanges();
          vehicleModelInstance.claimForm.controls['category'].setValue('category');

          const buttonTrigger = fixture.debugElement.nativeElement.querySelector('.vin-form button');
          buttonTrigger.click();
          fixture.detectChanges();
          expect((<any>vehicleModelInstance).router.navigate).toHaveBeenCalledWith(['/damage', objMockPostData.data.slug]);
        });
      });
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
