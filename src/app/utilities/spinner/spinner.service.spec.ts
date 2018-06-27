import {
  async,
  TestBed,
  inject
} from '@angular/core/testing';
import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        SpinnerService
      ]
    }).compileComponents();
  }));

  it("#should call set_active's next subject when startting", inject([SpinnerService], (spinnerService: SpinnerService) => {
    spyOn((<any>spinnerService).status, 'next');
    spinnerService.start(1);
    expect((<any>spinnerService).status.next).toHaveBeenCalled();
  }));

  it("#_active variable should be false on stop event", inject([SpinnerService], (spinnerService: SpinnerService) => {
    spinnerService.stop();
    expect(spinnerService._active).toEqual(false);
  }));
});
