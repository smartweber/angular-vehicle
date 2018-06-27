import {
  async,
  TestBed
} from '@angular/core/testing';
import {
  RouterTestingModule
} from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';
import { Router, NavigationStart, Route } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { StoreService } from '../services/store.service';
import { EventService } from '../services/event.service';
import { MoreComponent } from './more.component';


describe('MoreComponent', () => {
  let fixture: any;
  let moreInstance: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        StoreService,
        EventService,
        {
          provide: Router, useClass: MockRouter
        },
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      declarations: [ MoreComponent ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(MoreComponent);
      moreInstance = fixture.debugElement.componentInstance;
      moreInstance.ngOnInit();
    });
  }));

  it('#init function should work', () => {
    moreInstance._storeService.setObject('load_topbar_data',{data: 'data'});
    spyOn(moreInstance._eventService, 'emit');
    moreInstance.init();
    fixture.detectChanges();
    expect(moreInstance._eventService.emit).toHaveBeenCalled();
  });
});

class MockRouter {
  public ne = new NavigationStart(0, 'http://localhost:404/more/11');
  events = new Observable((observer: any) => {
    observer.next(this.ne);
    observer.complete();
  });
}

