import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay, DialogRef } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { ConfirmModalComponent } from './confirm-modal.component';
import { StoreService }  from '../../services/store.service';
import { DataService }  from '../../services/data.service';

describe('ConfirmModalComponent', () => {
  let fixture: any;
  let confirmModalComponent: any;
  let mockDataService: any;
  let mockData = {};
  let mockDialog = {
     context: {
      imgURL: 'http://imgurl.com',
      title: 'title',
      carmapHandler: {
        carImgMap: {
          updatePolygon: function(list: any[]) {
            return list;
          },
          deleteCheckMark: function(id: number) {
            return id;
          },
          updateCheckMark: function(list: any[]) {
            return list;
          }
        },
        markList: [
          {
            id: 0
          },
          {
            id: 1
          }
        ],
        doneAutoPart: function(list: any[]) {
          return list;
        }
      }
    },
    close: function(data: Object) {
      return data;
    }
  };

  beforeEach(async(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: DialogRef, useValue: mockDialog },
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot()
      ],
      providers: [
        MODAL_PROVIDERS,
        StoreService,
        { provide: DataService, useValue: new MockDataService() }
      ],
      declarations: [
        ConfirmModalComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(ConfirmModalComponent);
      confirmModalComponent = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnValue = mockData;
    });
  }));

  it('#DeleteMark function should work', () => {
    expect(confirmModalComponent.markList.length).toEqual(2);
    confirmModalComponent.markId = 0;
    confirmModalComponent.markList[confirmModalComponent.markId] = {
      id: 1
    };
    spyOn((confirmModalComponent.carmapHandler as any).carImgMap, 'updatePolygon');
    spyOn(confirmModalComponent.carmapHandler, 'doneAutoPart');
    confirmModalComponent.DeleteMark();
    fixture.detectChanges();
    expect(confirmModalComponent.markList.length).toEqual(1);
    expect((confirmModalComponent.carmapHandler as any).carImgMap.updatePolygon).toHaveBeenCalled();
    expect(confirmModalComponent.carmapHandler.doneAutoPart).toHaveBeenCalled();
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
