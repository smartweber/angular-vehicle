import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '../utilities/spinner/spinner.service';

/**
 * This class represents the lazy loaded DisclaimerComponent.
 */
@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css']
})
export class DisclaimerComponent implements OnInit {
	strSlug: string;
	bIsLoading: boolean;
	bIsExistSlug: boolean;

	constructor(
		private route: ActivatedRoute,
		private _spinner: SpinnerService,
		private router: Router
	) {
		this.strSlug = '';
		this.bIsLoading = false;
		this.bIsExistSlug = false;
	}

	ngOnInit() {
		this.route.params.subscribe(params=> {
			this.strSlug = params['slugId'];

			if(this.strSlug) {
				this.bIsExistSlug = true;
				this._spinner.start();
				let that = this;
				setTimeout(function() {
					that._spinner.stop();
					that.bIsLoading = true;
				}, 3000);
			} else {
				this.bIsLoading = true;
			}
		});
	}

	next() {
		this.router.navigate(['/estimate', this.strSlug]);
	}
}
