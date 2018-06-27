import { inject, TestBed, async } from '@angular/core/testing';
import { ShowImgModalService } from './show-img-modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

describe('ShowImageModalService', () => {
  let showImgModalService: ShowImgModalService = null;
  let viewRef: any;

  beforeEach(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      providers: [
        ShowImgModalService,
        MODAL_PROVIDERS
      ],
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule
      ]
    }).compileComponents();
  });

  beforeEach(inject([ShowImgModalService], (modalService: ShowImgModalService, view: ViewContainerRef) => {
    showImgModalService = modalService;
    viewRef = view;
  }));

  it('#openDialog function should work', () => {
    spyOn((<any>showImgModalService).modal, 'open').and.returnValue(
      Promise.resolve(1)
    );
    showImgModalService.openDialog('title', 'url', null, viewRef);
    expect((<any>showImgModalService).modal.open).toHaveBeenCalled();
  });

  it('#closeDialog function should work', () => {
    function closeModal() {}
    showImgModalService.dialog = <any>{};
    showImgModalService.dialog.close = closeModal;
    spyOn(showImgModalService.dialog, 'close');
    showImgModalService.closeDialog();
    expect(showImgModalService.dialog.close).toHaveBeenCalled();
  });
});
