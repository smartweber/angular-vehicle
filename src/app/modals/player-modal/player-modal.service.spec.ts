import { inject, TestBed, async } from '@angular/core/testing';
import { PlayerModalService } from './player-modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

describe('PlayerModalService', () => {
  let playerModalService: PlayerModalService = null;
  let viewRef: any;

  beforeEach(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      providers: [
        PlayerModalService,
        MODAL_PROVIDERS
      ],
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule
      ]
    }).compileComponents();
  });

  beforeEach(inject([PlayerModalService], (modalService: PlayerModalService, view: ViewContainerRef) => {
    playerModalService = modalService;
    viewRef = view;
  }));

  it('#openDialog function should work', () => {
    spyOn((<any>playerModalService).modal, 'open').and.returnValue(
      Promise.resolve(1)
    );
    playerModalService.openDialog('Hello', viewRef);
    expect((<any>playerModalService).modal.open).toHaveBeenCalled();
  });

  it('#closeDialog function should work', () => {
    function closeModal() {}
    playerModalService.dialog = <any>{};
    playerModalService.dialog.close = closeModal;
    spyOn(playerModalService.dialog, 'close');
    playerModalService.closeDialog();
    expect(playerModalService.dialog.close).toHaveBeenCalled();
  });
});
