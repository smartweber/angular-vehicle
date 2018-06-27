import {
  async,
  TestBed
} from '@angular/core/testing';
import { ViewContainerRef } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService }  from '../services/data.service';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { DamageComponent } from './damage.component';
import { DotSliderComponent } from '../utilities/dot-slider/dot-slider.component';
import { CarMapComponent } from '../utilities/car-map/car-map.component';
import { ImageMapComponent } from '../utilities/image-map/image-map.component';
import { EventService } from '../services/event.service';
import { AlertModalService } from '../modals/alert-modal/alert-modal.service';
import { DamageModalService }  from '../modals/damage-modal/damage-modal.service';
import { ConfirmModalService }  from '../modals/confirm-modal/confirm-modal.service';

describe('DamageComponent', () => {
  let fixture: any;
  let damageInstance: any;
  let mockDataService: any;
  let mockAlertModalService: MockAlertModalService;
  let mockDamageModalService: MockDamageModalService;
  let mockConfirmModalService: MockConfirmModalService;
  let mockData =  {
    data: {
      help: {
        icon: 'http://icon.png',
        on: 1,
        link: 'http://link.com'
      },
      liveHelp: {
        icon: 'http://icon.png',
        on: 1
      },
      steps: {
        totalStep: 3,
        currentStep: 1
      },
      ui: {
        logo: 'http://logo.png'
      }
    }
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
      imports: [
        HttpModule,
        ModalModule.forRoot(),
        BootstrapModalModule
      ],
      providers: [
        MODAL_PROVIDERS,
        EventService,
        { provide: AlertModalService, useClass: MockAlertModalService },
        { provide: DamageModalService, useClass: MockDamageModalService },
        { provide: ConfirmModalService, useClass: MockConfirmModalService },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'slug' })
          }
        },
        { provide: DataService, useValue: new MockDataService() },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ],
      declarations: [
        DamageComponent,
        DotSliderComponent,
        CarMapComponent,
        ImageMapComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(DamageComponent);
      damageInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnValue = mockData;

      mockAlertModalService = fixture.debugElement.injector.get(AlertModalService) as MockAlertModalService;
      spyOn(mockAlertModalService, 'openDialog').and.callThrough();
      mockAlertModalService.returnValue = objMockModalData;

      mockDamageModalService = fixture.debugElement.injector.get(DamageModalService) as MockDamageModalService;
      spyOn(mockDamageModalService, 'openDialog').and.callThrough();
      mockDamageModalService.returnValue = objMockModalData;

      mockConfirmModalService = fixture.debugElement.injector.get(ConfirmModalService) as MockConfirmModalService;
      spyOn(mockConfirmModalService, 'openDialog').and.callThrough();
      mockConfirmModalService.returnValue = objMockModalData;
    });
  }));

  it('#ngOnInit function should work', () => {
    damageInstance.ngOnInit();
    fixture.detectChanges();
    expect(damageInstance.strSlug).toEqual('slug');
  });

  it('#loadData function should work', () => {
    damageInstance.strSlug = 'slug';
    damageInstance.bIsStart = true;
    spyOn((damageInstance as any)._eventService, 'emit');
    damageInstance.loadData('location');
    fixture.detectChanges();
    expect((damageInstance as any)._eventService.emit).toHaveBeenCalled();
  });

  it('#waitNextArea function should work', () => {
    damageInstance.bIsStart = true;
    fixture.detectChanges();
    damageInstance.waitNextArea(true);
    fixture.detectChanges();
    expect(damageInstance.bIsNext).toBeTruthy();
  });

  it('#next function should work to redirect to photo with slug', () => {
    damageInstance.strSlug = 'photo';
    damageInstance.next();
    expect(damageInstance.router.navigate).toHaveBeenCalledWith(['/photo', 'photo'])
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

class MockAlertModalService {
  returnValue: Object;

  openDialog(nType: number, alertData: any, viewContainer:ViewContainerRef): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}

class MockDamageModalService {
  returnValue: Object;

  openDialog(autoPartID: number, carMap:any, viewContainer: ViewContainerRef): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}

class MockConfirmModalService {
  returnValue: Object;

  openDialog(carmapHandler: any, markId: number, viewContainer: ViewContainerRef): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}
