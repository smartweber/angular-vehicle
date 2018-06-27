import {
  async,
  TestBed
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { ImageMapComponent }  from '../image-map/image-map.component';
import { DamageLocationComponent } from './damage-location.component';

describe('DamageLocationComponent', () => {
  let fixture: any;
  let damageLocationInstance: any;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ],
      declarations:[
        ImageMapComponent,
        DamageLocationComponent

      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(DamageLocationComponent);
      damageLocationInstance = fixture.debugElement.componentInstance;
    });
  }));

  it('#clickOnImage function should work', () => {
    spyOn((damageLocationInstance as any).getAnswerId, 'emit');
    damageLocationInstance.clickOnImage({
      value: 'value',
      id: 1
    });

    expect((damageLocationInstance as any).getAnswerId.emit).toHaveBeenCalledWith({
      answer: 'value',
      id: 1
    });
  });

  it('#updateLocation function should work', () => {
    let arrLocationList = [{
      value: 'value',
      id: 1
    }];
    function updatePolygon(){};
    damageLocationInstance.myImgMapHandler = <any>{};
    damageLocationInstance.myImgMapHandler.updatePolygon = updatePolygon;
    spyOn(damageLocationInstance.myImgMapHandler, 'updatePolygon');
    damageLocationInstance.updateLocation(arrLocationList);
    expect(damageLocationInstance.myImgMapHandler.updatePolygon).toHaveBeenCalledWith(arrLocationList);
  });
});
