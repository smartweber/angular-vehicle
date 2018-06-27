import {
  async,
  TestBed
} from '@angular/core/testing';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http, HttpModule
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home.component';
import { DataService }  from '../services/data.service';
import { StoreService }  from '../services/store.service';
import { SpinnerService }  from '../utilities/spinner/spinner.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('HomeComponent', () => {
  let fixture: any;
  let homeInstance: any;
  let mockDataService: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule
      ],
      providers: [
        StoreService,
        SpinnerService,
        RouterTestingModule,
        BaseRequestOptions,
        MockBackend,
        {provide: Http, useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'slugId' })
          }
        },
        {
          provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); }
        },
        { provide: DataService, useValue: new MockDataService() }
      ],
      declarations: [ HomeComponent ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      homeInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnValue = {
        data: {
          slug: 'slugId'
        },
        code: 200
      };
    });
  }));

  it('#ngOnInit function should work', () => {
    homeInstance.ngOnInit();
    fixture.detectChanges();
    expect(homeInstance.strSlug).toEqual('slugId');
  });

  it('#next function should work by clicking next button', () => {
    homeInstance.ngOnInit();
    fixture.detectChanges();
    expect(homeInstance.contactForm.valid).toBeFalsy();
    homeInstance.contactForm.controls['claim_id'].setValue(12334);
    // Trigger the login function
    homeInstance.next();
    fixture.detectChanges();
    expect(homeInstance.router.navigate).toHaveBeenCalledWith(['/vehicle', 'slugId']);
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

