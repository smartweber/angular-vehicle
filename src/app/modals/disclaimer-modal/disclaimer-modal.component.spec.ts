import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayRenderer, DOMOverlayRenderer, Overlay, DialogRef, ModalModule } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { Router } from '@angular/router';
import { DisclaimerModalComponent } from './disclaimer-modal.component';

describe('DisclaimerModalComponent', () => {
  let component: DisclaimerModalComponent;
  let fixture: ComponentFixture<DisclaimerModalComponent>;
  let mockDialog = {
    context: {
      disclaimerData: 111
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
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ],
      declarations: [ DisclaimerModalComponent ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(DisclaimerModalComponent);
      component = fixture.debugElement.componentInstance;
    });
  }));

  it('ngOnInit function should work',
    async(() => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    }));
});