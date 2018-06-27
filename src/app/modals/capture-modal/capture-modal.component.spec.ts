import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { OverlayRenderer, DOMOverlayRenderer, Overlay, DialogRef, ModalModule } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { Router } from '@angular/router';
import { ElementRef } from '@angular/core';
import { CaptureModalComponent } from './capture-modal.component';

describe('CaptureModalComponent', () => {
  let fixture: ComponentFixture<CaptureModalComponent>;
  let captureModalComponent: CaptureModalComponent;
  let elementRef: ElementRef;
  let mockDialog = {
    context: {
      uploader: {
        onProgressAll: function(progress: any) {

        },
        onCompleteItem: function(item: any, res: any, status: any, headers: any) {

        }
      }
    },
    close: function(data: Object) {
      return data;
    }
  };

  beforeEach(async(() => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: DialogRef, useValue: mockDialog },
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];

    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot()
      ],
      providers: [
        MODAL_PROVIDERS,
        // { provide: ElementRef, useClass: MockElementRef },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ],
      declarations: [ CaptureModalComponent ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(CaptureModalComponent);
      captureModalComponent = fixture.debugElement.componentInstance;
    });
  }));

  // beforeEach(inject([MockElementRef], (ref: MockElementRef) => {
  //   elementRef = ref;
  // }));

  it('#OnInit function should work', () => {
    expect(captureModalComponent.bIsSuccessResult).toBeFalsy();
    // captureModalComponent.fileProgress = elementRef;
    // captureModalComponent.strCurrentStatus = captureModalComponent.arrStrSTATUSES[0];
    // function setElement() {}
    // captureModalComponent.renderer = <any>{};
    // captureModalComponent.renderer.setElementStyle = setElement;
    // spyOn(captureModalComponent.renderer, 'setElementStyle');
    // captureModalComponent.ngOnInit();
    // captureModalComponent.context.uploader.onProgressAll(1);
    // expect(true).toBeTruthy();
    // expect(captureModalComponent.renderer.setElementStyle).toHavebeenCalled();
  });
});

// class MockElementRef {
//   public nativeElement;
// }