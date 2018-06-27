import {
  async,
  TestBed
} from '@angular/core/testing';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { UploadModalComponent } from './upload-modal.component';
import { Router } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay, DialogRef } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';

export function main() {
   describe('Show Image Modal component', () => {
    let fixture: any;
    let uploadModalInstance: any;
    let mockDialog = {
       context: {
        index: 1,
        imgLIST: [
          {
            id: 1,
            text: 'text1',
            desc: 'description1',
            img: 'https://img1.png'
          },
          {
            id: 2,
            text: 'text2',
            desc: 'description2',
            img: 'https://img2.png'
          },
          {
            id: 3,
            text: 'text3',
            desc: 'description3',
            img: 'https://img3.png'
          }
        ],
        postData: {
          data: {
            slug: 'slug'
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
          HttpModule,
          ModalModule.forRoot(),
          FileUploadModule
        ],
        providers: [
          MODAL_PROVIDERS,
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
        ],
        declarations: [
          UploadModalComponent
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UploadModalComponent);
        uploadModalInstance = fixture.debugElement.componentInstance;
      });
    }));

    it('ngOnInit function should work',
      async(() => {
        uploadModalInstance.ngOnInit();
        fixture.detectChanges();
        expect(uploadModalInstance.selectedImgIndex).toEqual(mockDialog['context']['index']);
      }));

    it('onCancel function should work',
      async(() => {
        spyOn(uploadModalInstance.dialog, 'close');
        uploadModalInstance.onCancel();
        fixture.detectChanges();
        expect(uploadModalInstance.dialog.close).toHaveBeenCalled();
      }));

    it('changeInfo function should work',
      async(() => {
        uploadModalInstance.changeInfo(0);
        expect(uploadModalInstance.title).toEqual(uploadModalInstance.requiredImgLIST[0]['text']);
        expect(uploadModalInstance.description).toEqual(uploadModalInstance.requiredImgLIST[0]['desc']);
        expect(uploadModalInstance.imgURL).toEqual(uploadModalInstance.backendApi + uploadModalInstance.requiredImgLIST[0]['img']);
      }));
  });
}

