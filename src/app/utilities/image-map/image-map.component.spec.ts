import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ImageMapComponent } from './image-map.component';
import { DataService }       from '../../services/data.service';
import { EventService }      from '../../services/event.service';

describe('Image map component', () => {
  let fixture: any;
  let imInstance: any;
  let mockDataService: any;
  let mockData = {
    data: {
      top_map: '',
      top_img: '',
      img: 'assets/images/logo-large.png',
      map: {
          1: {
            Coordinates:'21, 43, 14, 87'
          },
          2: {
            Coordinates:'22, 43, 14, 87'
          }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImageMapComponent
      ],
      providers: [
        EventService,
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
        { provide: DataService, useValue: new MockDataService() }
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(ImageMapComponent);
      imInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnValue = mockData;
    });
  }));

  it('#ngOnInit function should work', () => {
    spyOn(imInstance, 'mappingData');
    spyOn(imInstance._eventService, 'registerEvent');
    imInstance.mapData = {
      data: {
        width: 10,
        height: 10
      }
    };
    imInstance.ngOnInit();
    expect(imInstance.mappingData).toHaveBeenCalled();
    expect(imInstance._eventService.registerEvent).toHaveBeenCalled();
  });

  it('#mappingData function should work', () => {
    imInstance.bPreShowDamages = true;
    spyOn(imInstance, 'loadCarImage');
    imInstance.mappingData(mockData);
    expect(imInstance.mapList.length).toBe(2);
    expect(imInstance.loadCarImage).toHaveBeenCalled();
  });

  it('#getSliderData function should work', () => {
    imInstance.mapList = [
      {
        data: {
          section: 0,
          side: 'left',
          index: 0
        }
      },
      {
        data: {
          section: 0,
          side: 'left',
          index: 1
        }
      },
      {
        data: {
          section: 0,
          side: 'right',
          index: 2
        }
      }
    ];

    expect(imInstance.mapList.length).toEqual(3);
    imInstance.getSliderData();
    expect(imInstance.leftSliders.length).toEqual(2);
  });

  it('#checkPolygonIndex function should work', () => {
    imInstance.selectedPolygonList = [
      {
        id: 0,
        value: 0
      },
      {
        id: 1,
        value: 1
      }
    ];

    let b = imInstance.checkPolygonIndex(1);
    expect(b).toEqual(true);
  });

  it('#loadCarImage function should work', () => {
    imInstance.bPreShowDamages = true;
    imInstance.bIsMapImgLaod = true;
    imInstance.imageMapId = 1;
    imInstance.mapData = mockData;
    imInstance.mapProperties = {
      x: 400,
      y: 300
    };
    imInstance.mapStyle = {
      bgColor: 'red',
      borderColor: 'red',
      bgOpacity: 1,
      borderWidth: 2
    };
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      imInstance.loadCarImage();
      fixture.detectChanges();
      expect(imInstance.getMapContainerSize).toHaveBeenCalled();
    });
  });

  it('#isPointInPoly function should work', () => {
    let area = [
      {
        x: 0,
        y: 0
      },
      {
        x: 100,
        y: 0
      },
      {
        x: 0,
        y: 100
      },
      {
        x: 100,
        y: 100
      }
    ];
    let point = {
      x: 10, y: 10
    };
    let b = imInstance.isPointInPoly(area, point);
    expect(b).toBeTruthy();
  });

  it('#getPolygonData function should work', () => {
    imInstance.mapList = [
      {
        index: 0,
        parentPolygons: 0
      },
      {
        index: 1,
        parentPolygons: 1
      }
    ];
    let b = imInstance.getPolygonData(1);
    expect(b).toEqual(imInstance.mapList[1]['parentPolygons']);
  });

  it('#getCheckMarkPostion function should work', () => {
    imInstance.mapList = [
      {
        index: 0,
        polygon: [
          {
            x: 10,
            y: 10
          },
          {
            x: 20,
            y: 10
          },
          {
            x: 20,
            y: 20
          },
          {
            x: 10,
            y: 20
          }
        ]
      }
    ];
    let position = imInstance.getCheckMarkPostion(0);
    expect(position.x).toEqual(15);
    expect(position.y).toEqual(15);
  });

  it('#getDamageData function should work', () => {
    imInstance.mapList = [
      {
        index: 0,
        parentPolygons: {
          Title: 'Bound Box'
        },
        child: [
          {
            data: 'data',
            index: 1,
            polygons: [
              {
                x: 0,
                y: 0
              },
              {
                x: 10,
                y: 0
              },
              {
                x: 0,
                y: 10
              }
            ]
          }
        ],
        sub: [
          {
            data: {
              id: 0
            },
            polygons: [
              {
                x: 5,
                y: 5
              },
              {
                x: 10,
                y: 10
              },
              {
                x: 20,
                y: 10
              }
            ]
          }
        ]
      },
      {
        index: 2,
        parentPolygons: 1
      }
    ];
    let r = imInstance.getPolygonData(1);
    expect(r).toBeDefined();
  });
});

class MockDataService {

  returnValue: Object;
  host:string = 'https://angular-meteor.com/';

  post(url:string='', postdata: any={}): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}
