import { inject, TestBed, async } from '@angular/core/testing';
import { AlertModalService } from './alert-modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';


describe('AlertModalService', () => {
  let alertModalService: AlertModalService = null;
  let viewRef: any;

  beforeEach(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      providers: [
        AlertModalService,
        MODAL_PROVIDERS
      ],
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule
      ]
    }).compileComponents();
  });

  beforeEach(inject([AlertModalService], (modalService: AlertModalService, view: ViewContainerRef) => {
    alertModalService = modalService;
    viewRef = view;
  }));

  it('#openDialog function should work', () => {
    spyOn((<any>alertModalService).modal, 'open').and.returnValue(
      Promise.resolve(1)
    );
    alertModalService.openDialog(1, 'Hello', viewRef);
    expect((<any>alertModalService).modal.open).toHaveBeenCalled();
  });

  it('#closeDialog function should work', () => {
    function closeModal() {}
    alertModalService.dialog = <any>{};
    alertModalService.dialog.close = closeModal;
    spyOn(alertModalService.dialog, 'close');
    alertModalService.closeDialog();
    expect(alertModalService.dialog.close).toHaveBeenCalled();
  });
});
