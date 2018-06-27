import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { ConfirmModalContent } from './confirm-modal-content.component';
import { CarMapComponent } from '../../utilities/car-map/car-map.component';
import { DataService } from '../../services/data.service';
import { StoreService }  from '../../services/store.service';

@Component({
    selector: 'app-confirm-modal',
	templateUrl: './confirm-modal.component.html',
	styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements ModalComponent<ConfirmModalContent> {
    context: ConfirmModalContent;
    carmapHandler: CarMapComponent;
    markList: any[];
    markId: number;

    constructor(public dialog: DialogRef<ConfirmModalContent>,
      private _storeService: StoreService,
      private _dataService: DataService) {
      this.carmapHandler = dialog.context.carmapHandler;
      this.markList = dialog.context.carmapHandler.markList;
      this.markId = (dialog.context as any).markId;
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    Cancel() {
        this.dialog.close();
    }

    DeleteMark() {
      let deletedId = this.markList[this.markId].id;
      let postData = {
        code: 200,
        data: {
          slug: this.carmapHandler.slug,
          autoPartID: deletedId
        }
      };

      this._dataService.post('v1/data/autopartremove', postData)
        .subscribe((res: any) => {
          this.markList.splice(this.markId, 1);
          this.carmapHandler.carImgMap.deleteCheckMark(deletedId);
          this.carmapHandler.carImgMap.updatePolygon(this.markList);
          this.carmapHandler.doneAutoPart(this.markList);
          this.dialog.close();
        }, (error: any) => console.error('Unable to fetch brands', error));
    }
}
