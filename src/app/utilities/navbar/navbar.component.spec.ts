import {
  async,
  TestBed
} from '@angular/core/testing';
import { Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { NavbarComponent }         from './navbar.component';
import { NavbarService }           from '../../services/navbar.service';
import { StoreService }            from '../../services/store.service';

describe('NavbarComponent', () => {
   let fixture: any;
   let nbInstance: any;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        NavbarComponent
      ],
      providers: [
        NavbarService,
        StoreService,
        {
          provide: Router, useClass: RouterStub
        }
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(NavbarComponent);
      nbInstance = fixture.debugElement.componentInstance;
    });
  }));

  it('#ngOnInit function should work', () => {
    spyOn(nbInstance._navbarService, 'getEvent').and.returnValue(
      Observable.of('')
    );
    spyOn(nbInstance, 'setActions');
    nbInstance.ngOnInit();
    expect(nbInstance.setActions).toHaveBeenCalled();
    expect(nbInstance._navbarService.getEvent).toHaveBeenCalled();
  });

  it('#moreAction function should work', () => {
    spyOn(nbInstance._router, 'navigate');
    nbInstance.strSlug = 'slug';
    nbInstance.moreAction('url', 'text', 1);
    expect(nbInstance.nSelectedMoreIndex).toEqual(1);
    expect(nbInstance._router.navigate).toHaveBeenCalledWith(['/more', 'slug']);
  });
});

class RouterStub {
  public url: string;
  private subject = new Subject();
  private events = this.subject.asObservable();

  navigate(url: string) {
    this.url = url;
    this.triggerNavEvents(url);
  }

  triggerNavEvents(url: string) {
    let ne = new NavigationStart(0, url);
    this.subject.next(ne);
  }
}
