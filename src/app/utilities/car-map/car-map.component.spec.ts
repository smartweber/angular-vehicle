import {
  async,
  TestBed
} from '@angular/core/testing';
import {
  HttpModule
} from '@angular/http';
import { ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { Router }              from '@angular/router';
import { DataService }         from '../../services/data.service';
import { EventService }        from '../../services/event.service';
import { DamageModalService }  from '../../modals/damage-modal/damage-modal.service';
import { ConfirmModalService } from '../../modals/confirm-modal/confirm-modal.service';
import { ImageMapComponent }   from '../image-map/image-map.component';
import { CarMapComponent }  from './car-map.component';

describe('CarmapComponent', () => {
  let fixture: any;
  let carmapInstance: any;
  let mockDataService: any;
  let mockConfirmModalService: any;
  let mockDamageModelService: any;
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

  let mockModalData = {
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
        ViewContainerRef,
        MODAL_PROVIDERS,
        EventService,
        { provide: DataService, useValue: new MockDataService() },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
        { provide: DamageModalService, useValue: new MockDamageModalService() },
        { provide: ConfirmModalService, useValue: new MockConfirmModalService() }
      ],
      declarations: [
        CarMapComponent,
        ImageMapComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(CarMapComponent);
      carmapInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnValue = mockData;

      mockDamageModelService = fixture.debugElement.injector.get(DamageModalService) as MockDamageModalService;
      spyOn(mockDamageModelService, 'openDialog').and.callThrough();
      mockDamageModelService.returnValue = mockModalData;

      mockConfirmModalService = fixture.debugElement.injector.get(ConfirmModalService) as MockConfirmModalService;
      spyOn(mockConfirmModalService, 'openDialog').and.callThrough();
      mockConfirmModalService.returnValue = mockModalData;
    });
  }));

  it('#insertMarkToList function should work', () => {
    carmapInstance.markList = [];
    carmapInstance.insertMarkToList({id: 1});
    expect(carmapInstance.insertMarkToList.length).toEqual(1);
    // if the item is existed, it won't be added
    carmapInstance.insertMarkToList({id: 1});
    expect(carmapInstance.insertMarkToList.length).toEqual(1);
  });

  it('#initMarkList function should work', () => {
    let arrObjInitData = [{id: 1}];
    spyOn((carmapInstance as any).initEventData, 'emit');
    carmapInstance.initMarkList(arrObjInitData);
    expect((carmapInstance as any).initEventData.emit).toHaveBeenCalledWith(true);
    expect(carmapInstance.markList).toEqual(arrObjInitData);
  });

  it('#clickOnImage function should work', () => {
    let arrObjInitData = [{
      id: 1,
      value: {
        AutoPartID: 1
      }
    }];
    carmapInstance.markList = [];
    carmapInstance.clickOnImage(arrObjInitData[0]);
    expect(carmapInstance._damageModalService.openDialog).toHaveBeenCalled();
    expect(carmapInstance.markList).toEqual(arrObjInitData);
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

class MockDamageModalService {
  returnValue: Object;

  openDialog(autoPartID: number, carMap:any, viewContainer: any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}

class MockConfirmModalService {
  returnValue: Object;

  openDialog(carmapHandler: any, markId: number, viewContainer: any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}
