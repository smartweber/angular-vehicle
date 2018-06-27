import {
  async,
  TestBed,
  fakeAsync
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { EstimateComponent } from './estimate.component';
import { DotSliderComponent } from '../utilities/dot-slider/dot-slider.component';
import { DataService }            from '../services/data.service';
import { StoreService }           from '../services/store.service';
import { EventService }           from '../services/event.service';
import { NavbarService }          from '../services/navbar.service';
import { SpinnerService }         from '../utilities/spinner/spinner.service';
import { DisclaimerModalService } from '../modals/disclaimer-modal/disclaimer-modal.service';

describe('Estimate component', () => {
  let fixture: any;
  let estimateInstance: any;
  let mockDataService: any;
  let mockDisclaimerModalService: MockDisclaimerModalService;
  let mockData =  {
    data: {
      steps: [1,2,3],
      help: {
        icon: 'http://icon.png',
        on: 1,
        link: 'http://link.com'
      },
      liveHelp: {
        icon: 'http://icon.png',
        on: 1
      },
      estimateHtml: '',
      showDisclaimer: true,
      disclaimer: 'disclaimer',
      ui: {
        logo: 'http://icon.png'
      }
    },
    _body: ''
  };

  let objMockModalData = {
    result: Promise.resolve(true)
  };

  beforeEach(async(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      providers: [
        EventService,
        SpinnerService,
        StoreService,
        MODAL_PROVIDERS,
        NavbarService,
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'slug' })
          }
        },
        { provide: DisclaimerModalService, useClass: MockDisclaimerModalService },
        { provide: DataService, useValue: new MockDataService() },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ],
      declarations: [
        EstimateComponent,
        DotSliderComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(EstimateComponent);
      estimateInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      spyOn(mockDataService, 'get').and.callThrough();
      mockDataService.returnValue = mockData;

      mockDisclaimerModalService = fixture.debugElement.injector.get(DisclaimerModalService) as MockDisclaimerModalService;
      spyOn(mockDisclaimerModalService, 'openDialog').and.callThrough();
      mockDisclaimerModalService.returnValue = objMockModalData;
    });
  }));

  it('#ngOnInit function should work', () => {
    estimateInstance.ngOnInit();
    fixture.detectChanges();
    fixture.detectChanges();
    expect((estimateInstance as any)._disclaimerModal.openDialog).toHaveBeenCalled();
  });

  it('#init function should work', () => {
    estimateInstance.bIsLoading = true;
    fixture.detectChanges();
    estimateInstance.strEstimateData = 'estimate content';
    estimateInstance.init();
    fixture.detectChanges();
    expect(estimateInstance.displayElement.nativeElement.innerHTML).toContain(estimateInstance.strEstimateData);
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

  get(url:string=''): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}

class MockDisclaimerModalService {
  returnValue: Object;

  openDialog(autoPartID: number, carMap:any, viewContainer: ViewContainerRef): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}
