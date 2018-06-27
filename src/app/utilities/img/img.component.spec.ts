import {
  async,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { HttpModule }           from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ImgComponent }           from './img.component';
import { DataService }            from '../../services/data.service';
import { EventService }           from '../../services/event.service';
import { StoreService }           from '../../services/store.service';
import { SpinnerService }      from '../../utilities/spinner/spinner.service';
import { UploadModalService }  from '../../modals/upload-modal/upload-modal.service';
import { ShowImgModalService } from '../../modals/show-img-modal/show-img-modal.service';

describe('ImageLocationComponent', () => {
   let fixture: any;
   let imgInstance: ImgComponent;
   let mockDataService: any;
   let mockData =  {
    data: {
      desc: 'description',
      slug: 'slug',
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
        icon: 'http://icons.com/icon.png',
        on: 1,
        link: 'http://link.com'
      },
      photos: [
        {
          required: true,
          id: '2121'
        }
      ]
    }
  };

  let mockShowImgModalService: any;
  let showIgmReturnData = {
    status: true,
    url: 'http://result.com'
  };

  let mockShowImgModelData = {
    result: Promise.resolve(showIgmReturnData)
  };

  beforeEach(async(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      declarations: [
        ImgComponent
      ],
      providers: [
        DataService,
        EventService,
        SpinnerService,
        StoreService,
        UploadModalService,
        ShowImgModalService,
        MODAL_PROVIDERS,
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'id' })
          }
        },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
        { provide: DataService, useValue: new MockDataService() },
        { provide: ShowImgModalService, useValue: new MockShowImgModalService() }
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(ImgComponent);
      imgInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnValue = mockData;

      mockShowImgModalService = fixture.debugElement.injector.get(ShowImgModalService) as MockShowImgModalService;
      spyOn(mockShowImgModalService, 'openDialog').and.callThrough();
      mockShowImgModalService.returnValue = mockShowImgModelData;
    });
  }));

  it('#ngOnInit function should work', () => {
    spyOn(imgInstance, 'checkNextStep');
    imgInstance.ngOnInit();
    expect(imgInstance.checkNextStep).toHaveBeenCalled();
    expect(imgInstance.slugId).toBe(mockData.data.slug);
  });

  it('#checkNextStep function should work', () => {
    spyOn((<any>imgInstance).checkStep, 'emit');
    imgInstance.arrObjImgList = [
      {required: true},
      {required: false}
    ];
    imgInstance.checkNextStep();
    expect((<any>imgInstance).checkStep.emit).toHaveBeenCalledWith(false);
  });

  it('#openUploadModal function should work', () => {
    imgInstance.arrObjImgList = [
      {uploaded: false, id: 0},
      {uploaded: true, id: 1}
    ];
    imgInstance.openUploadModal(1);
    expect(imgInstance.nSelectedItem).toBe(1);
    expect((imgInstance as any)._showImgModalService.openDialog).toHaveBeenCalled();
  });
});

class MockDataService {

  returnValue: Object;
  host = 'http://host.com';

  post(url:string='', postdata: any={}): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}

class MockShowImgModalService {
  returnValue: Object;

  openDialog(strTitle:string='', strImgUrl: string, objPostData: any={}, viewContainer: any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}
