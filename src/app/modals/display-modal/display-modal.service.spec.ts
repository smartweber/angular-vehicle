import { inject, TestBed, async } from '@angular/core/testing';
import { DisplayModalService } from './display-modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

describe('DisplayModalService', () => {
  let displayModalService: DisplayModalService = null;
  let viewRef: any;

  beforeEach(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      providers: [
        DisplayModalService,
        MODAL_PROVIDERS
      ],
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule
      ],
    }).compileComponents();
  });

  beforeEach(inject([DisplayModalService], (modalService: DisplayModalService, view: ViewContainerRef) => {
    displayModalService = modalService;
    viewRef = view;
  }));

  it('#openDialog function should work', () => {
    spyOn((<any>displayModalService).modal, 'open').and.returnValue(
      Promise.resolve(1)
    );
    displayModalService.openDialog('Hello', viewRef);
    expect((<any>displayModalService).modal.open).toHaveBeenCalled();
  });

  it('#closeDialog function should work', () => {
    function closeModal() {}
    displayModalService.dialog = <any>{};
    displayModalService.dialog.close = closeModal;
    spyOn(displayModalService.dialog, 'close');
    displayModalService.closeDialog();
    expect(displayModalService.dialog.close).toHaveBeenCalled();
  });
});
