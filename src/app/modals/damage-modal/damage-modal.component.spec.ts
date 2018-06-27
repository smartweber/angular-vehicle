import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay, DialogRef } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DataService }             from '../../services/data.service';
import { StoreService }            from '../../services/store.service';
import { EventService }            from '../../services/event.service';
import { DamageModalComponent }    from './damage-modal.component';
import { DamageLocationComponent } from '../../utilities/damage-location/damage-location.component';
import { LevelSliderComponent }    from '../../utilities/level-slider/level-slider.component';
import { ImageMapComponent }       from '../../utilities/image-map/image-map.component';
import { SpinnerService }          from '../../utilities/spinner/spinner.service';
declare var $: any;

describe('Damage Modal component', () => {
  let fixture: any;
  let damageWindowModalComponent: any;
  let mockDataService: any;
  let mockDialog = {
     context: {
      autoPartID: 213,
      carMap: {
        carImgMap: {
          updatePolygon: function(list: any[]) {
            return list;
          },
          updateCheckMark: function(list: any) {
            return list;
          },
          displayCheckMark() {
            return true;
          },
          slug: 'slug'
        },
        markList: [
          {
            id: 0
          },
          {
            id: 1
          }
        ]
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
        SpinnerService,
        EventService,
        { provide: DataService, useValue: new MockDataService() },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'slug' })
          }
        },
      ],
      declarations: [
        DamageModalComponent,
        LevelSliderComponent,
        DamageLocationComponent,
        ImageMapComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(DamageModalComponent);
      damageWindowModalComponent = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
    });
  }));

  it('#ngOnInit function should work', () => {
    damageWindowModalComponent.strSlug = 'slug';
    let res = {
      data: {
        callback: 'saveautopartquestion',
        answer: [
          {
            img: 'http://img.png'
          }
        ]
      }
    };

    mockDataService.returnValue = res;
    spyOn(damageWindowModalComponent, 'hideModal');
    fixture.detectChanges();
    damageWindowModalComponent.ngOnInit();
    expect(damageWindowModalComponent.hideModal).toHaveBeenCalled();
    expect(damageWindowModalComponent.damageQuestionData).toEqual(res.data);
    expect(damageWindowModalComponent.bIsTextQuestionType).toEqual(false);
  });

  it('#getMinMax function should work', () => {
    let data = [10, 9, 29, 5];
    let returnedData = damageWindowModalComponent.getMinMax(data);
    expect(returnedData[0]).toEqual(5);
    expect(returnedData[1]).toEqual(29);
  });

  it('#hideModal function should work', () => {
    damageWindowModalComponent.modalE = {
      length: 1,
      hide: function() {
        console.log('hide modal');
      }
    };
    spyOn((<any>damageWindowModalComponent).modalE, 'hide');
    damageWindowModalComponent.hideModal();
    expect((<any>damageWindowModalComponent).modalE.hide).toHaveBeenCalled();
  });

  it('#showModal function should work', () => {
    damageWindowModalComponent.modalE = {
      length: 1,
      show: function() {
        console.log('show modal');
      }
    };
    spyOn((<any>damageWindowModalComponent).modalE, 'show');
    damageWindowModalComponent.showModal();
    expect((<any>damageWindowModalComponent).modalE.show).toHaveBeenCalled();
  });

  it('#closeModal function should work', () => {
    damageWindowModalComponent.context.carMap.markList = [1,2];
    damageWindowModalComponent.closeModal();
    expect(damageWindowModalComponent.context.carMap.markList.length).toEqual(1);
  });

  it('#closeModal function should work', () => {
    spyOn(damageWindowModalComponent, 'displayCurrentStep');
    damageWindowModalComponent.nextLevel(1);
    expect(damageWindowModalComponent.displayCurrentStep).toHaveBeenCalled();

    damageWindowModalComponent.previousLevel(1);
    expect(damageWindowModalComponent.displayCurrentStep).toHaveBeenCalled();

    damageWindowModalComponent.closeHelper(1);
    expect(damageWindowModalComponent.displayCurrentStep).toHaveBeenCalled();
  });

  it('#damageFinalized function should work', () => {
    let res = {
      data: {
        callback: 'saveautopartquestion',
        message: 'No more questions.'
      }
    };

    mockDataService.returnValue = res;
    spyOn(damageWindowModalComponent, 'hideModal');
    spyOn(damageWindowModalComponent, 'showModal');
    spyOn(damageWindowModalComponent, 'waitForDMClose');
    spyOn((<any>damageWindowModalComponent).dialog, 'close');
    damageWindowModalComponent.damageFinalized();
    expect(damageWindowModalComponent.hideModal).toHaveBeenCalled();
    expect(damageWindowModalComponent.showModal).toHaveBeenCalled();
    expect((<any>damageWindowModalComponent).dialog.close).toHaveBeenCalled();
  });

  it('#insertAnswerToList function should work', () => {
    damageWindowModalComponent.arrIntDamageLocations = [{id:0}];
    expect(damageWindowModalComponent.insertAnswerToList ({id: 0})).toEqual(false);
  });

  it('#damageAreaFinalized function should work', () => {
    let res = {
      data: {
        answer: 1,
        message: 'No more questions.'
      }
    };

    mockDataService.returnValue = res;
    spyOn(damageWindowModalComponent, 'hideModal');
    spyOn(damageWindowModalComponent, 'showModal');
    spyOn(damageWindowModalComponent, 'waitForDMClose');
    damageWindowModalComponent.damageAreaFinalized();
    expect(damageWindowModalComponent.hideModal).toHaveBeenCalled();
    expect(damageWindowModalComponent.showModal).toHaveBeenCalled();
  });

  it('#onChangeState function should work', () => {
    damageWindowModalComponent.damageQuestionData.answer = [
      {
        id: 0,
        text: 'no'
      },
      {
        id: 1,
        text: 'yes'
      }
    ];
    damageWindowModalComponent.onChangeState({currentValue: 1});
    expect(damageWindowModalComponent.nQuestionOption).toEqual(1);
  });

  it('#getQuestionId function should work', () => {
    damageWindowModalComponent.damageQuestionData.answer = [
      {
        id: 0,
        text: 'incorrect'
      },
      {
        id: 1,
        text: 'correct'
      }
    ];
    expect(damageWindowModalComponent.getQuestionId('correct')).toEqual(1);
  });

  it('#damageQuestionsFinalized function should work', () => {
    let res = {
      data: {
        answer: 1,
        message: 'No more questions.'
      }
    };

    mockDataService.returnValue = res;
    spyOn(damageWindowModalComponent, 'hideModal');
    spyOn(damageWindowModalComponent, 'showModal');
    spyOn(damageWindowModalComponent, 'waitForDMClose');
    damageWindowModalComponent.damageQuestionsFinalized('func');
    expect(damageWindowModalComponent.hideModal).toHaveBeenCalled();
    expect(damageWindowModalComponent.showModal).toHaveBeenCalled();
    expect(damageWindowModalComponent.waitForDMClose).toHaveBeenCalledWith(1)
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
