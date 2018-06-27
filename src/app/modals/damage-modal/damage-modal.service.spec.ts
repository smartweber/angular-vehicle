import { inject, TestBed, async } from '@angular/core/testing';
import { ViewContainerRef } from '@angular/core';
import { DamageModalService } from './damage-modal.service';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'ngx-modialog';
import { Modal, BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

describe('DamageModalService', () => {
  let damageModalService: DamageModalService = null;
  let viewRef: any;

  beforeEach(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      providers: [
        DamageModalService,
        MODAL_PROVIDERS
      ],
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule
      ]
    }).compileComponents();
  });

  beforeEach(inject([DamageModalService], (modalService: DamageModalService, view: ViewContainerRef) => {
    damageModalService = modalService;
    viewRef = view;
  }));

  it('#openDialog function should work', () => {
    spyOn((<any>damageModalService).modal, 'open').and.returnValue(
      Promise.resolve(1)
    );
    damageModalService.openDialog(1, null, viewRef);
    expect((<any>damageModalService).modal.open).toHaveBeenCalled();
  });

  it('#closeDialog function should work', () => {
    function closeModal() {}
    damageModalService.dialog = <any>{};
    damageModalService.dialog.close = closeModal;
    spyOn(damageModalService.dialog, 'close');
    damageModalService.closeDialog();
    expect(damageModalService.dialog.close).toHaveBeenCalled();
  });
});
