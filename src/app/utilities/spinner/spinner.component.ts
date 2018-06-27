import {
	Component,
	OnInit,
	ChangeDetectorRef
} from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
	moduleId: module.id,
	selector: 'spinner-component',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
	bIsActive: boolean;
	nType: number;

	constructor (
		private _spinner: SpinnerService,
		private _changeDetectionRef : ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this._spinner.status.subscribe((result: Object) => {
			this.bIsActive = (result as any).status;
			this.nType = (result as any).type;
			this._changeDetectionRef.detectChanges();
		});
	}
}
