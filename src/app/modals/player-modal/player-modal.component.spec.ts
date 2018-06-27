import {
  async,
  TestBed
} from '@angular/core/testing';
import { DialogRef } from 'ngx-modialog';

declare var $: any;

import { PlayerModalComponent } from './player-modal.component';

import { VgCoreModule }               from 'videogular2/core';
import { VgControlsModule }           from 'videogular2/controls';
import { VgBufferingModule }          from 'videogular2/buffering';
import { VgOverlayPlayModule }        from 'videogular2/overlay-play';
import { VgStreamingModule }          from 'videogular2/streaming';


describe('Player Modal component', () => {
  let fixture: any;
  let pmComponent: any;
  let mockDialog = {
    context: {
      imgURL: 'http://image.com'
    },
    close: function() {
      return true;
    }
  };

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        VgCoreModule,
        VgControlsModule,
        VgBufferingModule,
        VgOverlayPlayModule,
        VgStreamingModule
      ],
      providers: [
        { provide: DialogRef, useValue: mockDialog }
      ],
      declarations: [
        PlayerModalComponent
      ]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(PlayerModalComponent);
      pmComponent = fixture.debugElement.componentInstance;
    });
  }));

  // it('#ngOnInit function should work', () => {
  //   fixture.whenStable().then(() => {
  //     expect(true).toBeTruthy();
  //   })
  //   // spyOn(pmComponent, 'adjustModalSize');
  //   // pmComponent.ngOnInit();
  //   // expect(pmComponent.adjustModalSize).toHaveBeenCalled();
  // });

  // it('modal should work',
  //   async(() => {
  //     fixture.detectChanges();
  //     expect(pmComponent.context).toBeDefined();
  //   }));

  // it('onCancel and closeModal function should work',
  //   async(() => {
  //     spyOn((<any>pmComponent).dialog, 'close');
  //     pmComponent.onCancel();
  //     fixture.detectChanges();
  //     expect((<any>pmComponent).dialog.close).toHaveBeenCalled();

  //     pmComponent.closeModal();
  //     fixture.detectChanges();
  //     expect((<any>pmComponent).dialog.close).toHaveBeenCalled();
  //   }));
});

