import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { PhotoComponent } from './photo.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { EventService } from '../services/event.service';
import { StoreService } from '../services/store.service';
import { UploadModalService } from '../modals/upload-modal/upload-modal.service';
import { ShowImgModalService } from '../modals/show-img-modal/show-img-modal.service'; 
import { SpinnerService } from '../utilities/spinner/spinner.service';
import { DotSliderComponent } from '../utilities/dot-slider/dot-slider.component';
import { ImgComponent } from '../utilities/img/img.component';

describe('PhotoComponent', () => {
  let fixture: any;
  let photoInstance: any;
  let mockDataService: any;
  let mockUploadModalService: MockUploadModalService;
  let mockShowImgModalService: MockShowImgModalService;
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
      photos: [
        {
          required: true
        }
      ]
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
        HttpModule
      ],
      declarations: [
        PhotoComponent,
        DotSliderComponent,
        ImgComponent
      ],
      providers: [
        EventService,
        SpinnerService,
        StoreService,
        MODAL_PROVIDERS,
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'slugId' })
          }
        },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
        { provide: DataService, useValue: new MockDataService() },
        { provide: UploadModalService, useClass: MockUploadModalService },
        { provide: ShowImgModalService, useClass: MockShowImgModalService }
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(PhotoComponent);
      photoInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnValue = mockData;

      mockUploadModalService = fixture.debugElement.injector.get(UploadModalService) as MockUploadModalService;
      spyOn(mockUploadModalService, 'openDialog').and.callThrough();
      mockUploadModalService.returnValue = objMockModalData;

      mockShowImgModalService = fixture.debugElement.injector.get(ShowImgModalService) as MockShowImgModalService;
      spyOn(mockShowImgModalService, 'openDialog').and.callThrough();
      mockShowImgModalService.returnValue = objMockModalData;
    });
  }));

  it('#ngOnInit function should work', () => {
    photoInstance.ngOnInit();
    expect(photoInstance.strSlugId).toEqual('slugId');
  });

  it('#getStepStatus function should work', () => {
    photoInstance.getStepStatus(true);
    expect(photoInstance.bIsNext).toBeTruthy();
  });

  it('#next function should work', () => {
    photoInstance.bIsNext = true;
    photoInstance.strSlugId = 'slug';
    photoInstance.next();
    expect(photoInstance.router.navigate).toHaveBeenCalledWith(['/estimate', 'slug']);
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

class MockUploadModalService {
  returnValue: Object;

  openDialog(arrObjImgLIST: Object[], nIndex: number, objPostData: Object, viewContainer:any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}

class MockShowImgModalService {
  returnValue: Object;

  openDialog(strTitle: string, strImgUrl: string, objPostData: Object, viewContainer:any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}
