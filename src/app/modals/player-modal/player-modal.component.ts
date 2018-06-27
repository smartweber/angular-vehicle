import {
    Component,
    ViewChild,
    ElementRef,
    Renderer,
    OnInit,
    OnDestroy
}  from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { PlayerModalContent }    from './player-modal-content.component';

@Component({
    selector: 'app-player-modal',
    templateUrl: './player-modal.component.html',
    styleUrls: ['./player-modal.component.css']
})
export class PlayerModalComponent implements ModalComponent<PlayerModalContent>, OnInit, OnDestroy {
    context: PlayerModalContent;
    sources: Array<Object>;
    @ViewChild('playModalElement') playModalElement: ElementRef;
    @ViewChild('media') media: ElementRef;
    nPlayModalWidth: number;
    nPlayModalHeight: number;

    constructor(
        public dialog: DialogRef<PlayerModalContent>,
        private el: ElementRef,
        private renderer: Renderer
    ) {
        this.context = dialog.context;
        this.sources = [
            {
                src: 'https://new-api.virtualevaluator.net/explainer.mp4',
                type: 'video/mp4'
            }
        ];

        this.nPlayModalWidth = 0;
        this.nPlayModalHeight = 0;
    }

    adjustModalSize(nCounter: number = 0) {
        if(nCounter > 300) {
            console.log('Time out to wait for the play modal');
        } else if(!this.playModalElement ||
            (this.playModalElement && this.playModalElement.nativeElement.offsetWidth < 50) || 
            !this.media ||
            (this.media && this.media.nativeElement.readyState !== 4)) {
            nCounter ++;
            setTimeout(() => this.adjustModalSize(nCounter), 50)
        } else {
            let nRatio: number = 406 / 720;
            nRatio = parseFloat(nRatio.toFixed(2));
            let nTargetWidth = nRatio * this.playModalElement.nativeElement.offsetHeight;
            let nTargetHeight = nTargetWidth / nRatio;
            this.renderer.setElementStyle(this.playModalElement.nativeElement, 'width', nTargetWidth.toFixed(2) + 'px');
            // this.renderer.setElementStyle(this.playModalElement.nativeElement, 'height', nTargetHeight.toFixed(2) + 'px');
            this.nPlayModalWidth = nTargetWidth;
        }
    }

    ngOnInit() {
       this.adjustModalSize(); 
    }

    ngOnDestroy() {

    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    onCancel() {
        this.dialog.close();
    }

    closeModal() {
        this.dialog.close();
    }
}

