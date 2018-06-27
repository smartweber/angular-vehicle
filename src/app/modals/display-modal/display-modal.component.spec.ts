import {
  async,
  TestBed
} from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { ViewContainerRef } from '@angular/core';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay, DialogRef } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { DisplayModalComponent }  from './display-modal.component';

describe('Display modal component', () => {
  let fixture: any;
  let dmInstance: any;
  let mockDialog = {
    context: {
      strHtml: '<div>hello</div>'
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
        HttpModule,
        ModalModule.forRoot(),
        BootstrapModalModule
      ],
      providers: [
        ViewContainerRef,
        MODAL_PROVIDERS,
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ],
      declarations: [
        DisplayModalComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(DisplayModalComponent);
      dmInstance = fixture.debugElement.componentInstance;
    });
  }));

  it('#loadData function should work', () => {
    dmInstance.loadData();
    fixture.detectChanges();
    expect(dmInstance.displayElement.nativeElement.innerHTML).toEqual(mockDialog.context.strHtml);
  });

  it('#gotoHome function should work', () => {
    spyOn(dmInstance.dialog, 'close');
    dmInstance.gotoHome();
    expect(dmInstance.dialog.close).toHaveBeenCalled();
    expect((<any>dmInstance).router.navigate).toHaveBeenCalledWith(['/']);
  });
});
