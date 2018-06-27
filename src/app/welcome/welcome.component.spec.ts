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
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { WelcomeComponent } from './welcome.component';
import { DataService }   from '../services/data.service';
import { SpinnerService }  from '../utilities/spinner/spinner.service';
import { PlayerModalService } from '../modals/player-modal/player-modal.service';

describe('WelcomeComponent', () => {
  let fixture: any;
  let welcomeInstance: WelcomeComponent;
  let mockDataService: MockDataService;
  let mockPlayerModalService: MockPlayerModalService;
  let objMockDataForDataService = {
    data: {
      forward: false,
      logo: 'http://logo.com/1.png',
      video_link_src: 'http://video.com/1.mp4',
      video_link_text: 'http://video.com/2.mp4',
      desc: 'desc',
      next_btn: 'next',
      callback: 'callback',
      video_link: 'http://video.com/3.mp4',
      video: 1
    }
  };

  let objMockPlayerModalData = {
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
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ WelcomeComponent ],
      providers: [
        SpinnerService,
        MODAL_PROVIDERS,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http, useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: PlayerModalService, useClass: MockPlayerModalService },
        { provide: DataService, useClass: MockDataService }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WelcomeComponent);
        welcomeInstance = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        spyOn(mockDataService, 'post').and.callThrough();
        mockDataService.returnValue = objMockDataForDataService;
        mockPlayerModalService = fixture.debugElement.injector.get(PlayerModalService) as MockPlayerModalService;
        spyOn(mockPlayerModalService, 'openDialog').and.callThrough();
        mockPlayerModalService.returnValue = objMockPlayerModalData;
      });
  }));

  it('#getWelcomeData function should get the data from back-end', () => {
    let strSlugId = 'slug';
    welcomeInstance.strSlugId = strSlugId;
    welcomeInstance.getWelcomeData();
    fixture.detectChanges();
    expect(welcomeInstance.strWelcomeDescription).toEqual(objMockDataForDataService.data.desc);
  });

  it('#play modal should be displayed by clicking', () => {
    welcomeInstance.bIsPageLoading = true;
    welcomeInstance.bIsVideoLink = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      if(fixture.nativeElement.querySelector('.img-wrapper')) {
        fixture.nativeElement.querySelector('.img-wrapper').click();
        spyOn(welcomeInstance, 'player')
        fixture.detectChanges();
        expect((<any>welcomeInstance)._playerModal.openDialog).toHaveBeenCalled();
      }
    });
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

class MockPlayerModalService {
  returnValue: Object;

  openDialog(strImgURL: string, viewContainer:any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }

  closeDialog() {
    return true;
  }
}
