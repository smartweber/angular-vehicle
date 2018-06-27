import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService }            from '../services/data.service';
import { EventService }           from '../services/event.service';
import { StoreService }           from '../services/store.service';
import { NavbarService }          from '../services/navbar.service';
import { SpinnerService }         from '../utilities/spinner/spinner.service';
import { NextComponent }          from './next.component';

describe('NextComponent', () => {
  let fixture: any;
  let nextInstance: any;
  let mockDataService: any;
  let mockDataServiceSpy: any;
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
      },
      action: {
        btns: ['next']
      }
    },
    _body: 'Next component'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextComponent ],
      providers: [
        EventService,
        SpinnerService,
        StoreService,
        NavbarService,
        { provide: DataService, useValue: new MockDataService() },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'slug' })
          }
        },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(NextComponent);
      nextInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      spyOn(mockDataService, 'get').and.callThrough();
      mockDataService.returnValue = mockData;
    });
  }));

  it('#ngOnInit function should work', () => {
    spyOn((nextInstance as any)._navbarService, 'setData');
    spyOn(nextInstance, 'renderNextBodyElement');
    nextInstance.ngOnInit();
    fixture.detectChanges();
    expect(nextInstance.strSlug).toEqual('slug');
    fixture.detectChanges();
    expect((nextInstance as any)._navbarService.setData).toHaveBeenCalled();
    fixture.detectChanges();
    expect(nextInstance.renderNextBodyElement).toHaveBeenCalled();
  });

  it('#should rendor body element with api _body', () => {
    nextInstance.bIsPageLoading = true;
    nextInstance.estimateData = 'estimate';
    fixture.detectChanges();
    nextInstance.renderNextBodyElement();
    fixture.detectChanges();
    expect(nextInstance.bodyElement.nativeElement.innerHTML).toContain(nextInstance.estimateData);
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

  get(url:string='', b: boolean): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}
