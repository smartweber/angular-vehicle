import { inject, TestBed, async } from '@angular/core/testing';
import { CaptureModalService } from './capture-modal.service';
import { ViewContainerRef } from '@angular/core';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

describe('CaptureModalService', () => {
  let captureModalService: CaptureModalService = null;
  let viewRef: any;

  beforeEach(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      providers: [
        CaptureModalService,
        MODAL_PROVIDERS
      ],
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule
      ],
    }).compileComponents();
  });

  beforeEach(inject([CaptureModalService], (modalService: CaptureModalService, view: ViewContainerRef) => {
    captureModalService = modalService;
    viewRef = view;
  }));

  it('#openDialog function should work', () => {
    spyOn((<any>captureModalService).modal, 'open').and.returnValue(
      Promise.resolve(1)
    );
    captureModalService.openDialog( 'Hello', viewRef);
    expect((<any>captureModalService).modal.open).toHaveBeenCalled();
  });

  it('#closeDialog function should work', () => {
    function closeModal() {}
    captureModalService.dialog = <any>{};
    captureModalService.dialog.close = closeModal;
    spyOn(captureModalService.dialog, 'close');
    captureModalService.closeDialog();
    expect(captureModalService.dialog.close).toHaveBeenCalled();
  });
});

