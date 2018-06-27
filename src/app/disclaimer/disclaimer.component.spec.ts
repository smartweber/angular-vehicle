import {
  fakeAsync,
  tick,
  TestBed,
  inject
} from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { DisclaimerComponent } from './disclaimer.component';
import { SpinnerService }  from '../utilities/spinner/spinner.service';

describe('DisclaimerComponent', () => {
  let fixture: any;
  let disclaimerInstance: any;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        SpinnerService,
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'slug' })
          }
        },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ],
      declarations: [
        DisclaimerComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(DisclaimerComponent);
      disclaimerInstance = fixture.debugElement.componentInstance;
    });
  }));

  it('#ngOnInit function should work', fakeAsync(() => {
    disclaimerInstance.ngOnInit();
    fixture.detectChanges();
    tick(3000);

    fixture.whenStable().then(() => {
      expect(disclaimerInstance.bIsLoading).toBeTruthy();
    })
  }));

  it('#next function should work to redirect to photo with slug', () => {
    disclaimerInstance.strSlug = 'photo';
    disclaimerInstance.next();
    expect(disclaimerInstance.router.navigate).toHaveBeenCalledWith(['/estimate', 'photo'])
  });
});

