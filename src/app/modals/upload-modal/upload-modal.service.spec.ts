import { inject, TestBed, async } from '@angular/core/testing';
import { UploadModalService } from './upload-modal.service';
import { ViewContainerRef } from '@angular/core';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

describe('UploadModalService', () => {
  let uploadModalService: UploadModalService = null;
  let viewRef: any;

  beforeEach(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      providers: [
        UploadModalService,
        MODAL_PROVIDERS
      ],
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule
      ]
    }).compileComponents();
  });

  beforeEach(inject([UploadModalService], (modalService: UploadModalService, view: ViewContainerRef) => {
    uploadModalService = modalService;
    viewRef = view;
  }));

  it('#openDialog function should work', () => {
    spyOn((<any>uploadModalService).modal, 'open').and.returnValue(
      Promise.resolve(1)
    );
    uploadModalService.openDialog([], 1, null, viewRef);
    expect((<any>uploadModalService).modal.open).toHaveBeenCalled();
  });

  it('#closeDialog function should work', () => {
    function closeModal() {}
    uploadModalService.dialog = <any>{};
    uploadModalService.dialog.close = closeModal;
    spyOn(uploadModalService.dialog, 'close');
    uploadModalService.closeDialog();
    expect(uploadModalService.dialog.close).toHaveBeenCalled();
  });
});
