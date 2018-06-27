import { inject, TestBed, async } from '@angular/core/testing';
import { ViewContainerRef } from '@angular/core';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { ConfirmModalService } from './confirm-modal.service';

describe('ConfirmModalService', () => {
  let confirmModalService: ConfirmModalService = null;
  let viewRef: any;

  beforeEach(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      providers: [
        ConfirmModalService,
        MODAL_PROVIDERS
      ],
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule
      ]
    }).compileComponents();
  });

  beforeEach(inject([ConfirmModalService], (modalService: ConfirmModalService, view: ViewContainerRef) => {
    confirmModalService = modalService;
    viewRef = view;
  }));

  it('#openDialog function should work', () => {
    spyOn((<any>confirmModalService).modal, 'open').and.returnValue(
      Promise.resolve(1)
    );
    confirmModalService.openDialog(null, 1, viewRef);
    expect((<any>confirmModalService).modal.open).toHaveBeenCalled();
  });

  it('#closeDialog function should work', () => {
    function closeModal() {}
    confirmModalService.dialog = <any>{};
    confirmModalService.dialog.close = closeModal;
    spyOn(confirmModalService.dialog, 'close');
    confirmModalService.closeDialog();
    expect(confirmModalService.dialog.close).toHaveBeenCalled();
  });
});
