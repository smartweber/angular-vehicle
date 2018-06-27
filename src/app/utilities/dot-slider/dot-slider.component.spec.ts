import {
  async,
  TestBed
} from '@angular/core/testing';

import { DotSliderComponent } from './dot-slider.component';

describe('DotSliderComponent', () => {
   let fixture: any;
   let dsInstance: DotSliderComponent;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        DotSliderComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(DotSliderComponent);
      dsInstance = fixture.debugElement.componentInstance;
    });
  }));

  it('#ngOnInit function should work', () => {
    spyOn(dsInstance, 'initSlider');
    dsInstance.sliderCount = 1;
    dsInstance.currentSliderCounter = 3;
    dsInstance.ngOnInit();
    expect(dsInstance.initSlider).toHaveBeenCalled();
  });

  it('#initSlider function should work', () => {
    dsInstance.arrNumSliderCounters = [];
    dsInstance.arrStrSliderBgColors = [];
    dsInstance.initSlider(3, 1);
    expect(dsInstance.arrNumSliderCounters.length).toEqual(3);
    dsInstance.arrNumSliderCounters = [];
    dsInstance.arrStrSliderBgColors = [];
    dsInstance.initSlider(2, 1);
    expect(dsInstance.arrStrSliderBgColors[0]).toBe('#3497fd');
    expect(dsInstance.arrStrSliderBgColors[1]).not.toBe('#3497fd');
  });
});
