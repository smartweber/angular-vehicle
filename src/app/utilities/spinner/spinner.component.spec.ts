import {
  async,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SpinnerComponent } from './spinner.component';
import { SpinnerService }   from './spinner.service';

describe('SpinnerComponent', () => {
  let fixture: any;
  let spInstance: any;
  let spinnerService: SpinnerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpinnerComponent
      ],
      providers: [
        SpinnerService
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(SpinnerComponent);
      spInstance = fixture.debugElement.componentInstance;
      spinnerService = TestBed.get(SpinnerService);
    });
  }));

  it('#ngOnInit should work', () => {
    spInstance.ngOnInit();
    spinnerService.status.next({status: true, type: 0});
    fixture.detectChanges();
    expect(spInstance.bIsActive).toBeTruthy();
  });
});
