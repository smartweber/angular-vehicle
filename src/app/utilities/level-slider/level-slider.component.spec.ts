import {
  async,
  TestBed
} from '@angular/core/testing';

import { LevelSliderComponent } from './level-slider.component';

describe('Level Slider component', () => {
   let fixture: any;
   let lsInstance: any;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        LevelSliderComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(LevelSliderComponent);
      lsInstance = fixture.debugElement.componentInstance;
    });
  }));

  it('#makeLevelBar function should work', () => {
    lsInstance.min = 1;
    lsInstance.max = 3;
    lsInstance.makeLevelBar();
    expect(lsInstance.values.length).toBe(3);
    expect(lsInstance.colors.length).toBe(4);
  });
});

