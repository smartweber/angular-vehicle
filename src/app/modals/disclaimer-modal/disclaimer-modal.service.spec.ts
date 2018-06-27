import { inject, TestBed, async } from '@angular/core/testing';
import { DisclaimerModalService } from './disclaimer-modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

describe('DamageModalService', () => {
  let disclaimerService: DisclaimerModalService = null;
  let viewRef: any;

  beforeEach(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      providers: [
        DisclaimerModalService,
        MODAL_PROVIDERS
      ],
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule
      ]
    }).compileComponents();
  });

  beforeEach(inject([DisclaimerModalService], (modalService: DisclaimerModalService, view: ViewContainerRef) => {
    disclaimerService = modalService;
    viewRef = view;
  }));

  it('#openDialog function should work', () => {
    spyOn((<any>disclaimerService).modal, 'open').and.returnValue(
      Promise.resolve(1)
    );
    disclaimerService.openDialog('Hello', viewRef);
    expect((<any>disclaimerService).modal.open).toHaveBeenCalled();
  });

  it('#closeDialog function should work', () => {
    function closeModal() {}
    disclaimerService.dialog = <any>{};
    disclaimerService.dialog.close = closeModal;
    spyOn(disclaimerService.dialog, 'close');
    disclaimerService.closeDialog();
    expect(disclaimerService.dialog.close).toHaveBeenCalled();
  });
});
