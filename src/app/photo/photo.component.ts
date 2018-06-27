import {
	Component,
	ViewContainerRef,
	OnInit
} from '@angular/core';
import { ActivatedRoute,
  Router } from '@angular/router';
import { SpinnerService } from '../utilities/spinner/spinner.service';
import { DataService } from '../services/data.service';
import { QuestionsModalService } from '../modals/questions-modal/questions-modal.service';

/**
 * This class represents the lazy loaded PhotoComponent.
 */
@Component({
	selector: 'app-photo',
	templateUrl: './photo.component.html',
	styleUrls: ['./photo.component.css']
})

export class PhotoComponent implements OnInit {
	strSlugId: string;
	bIsLoading: boolean;
	bIsNext: boolean;

	nTotoalStep: number;
	nCurrentStep: number;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private _dataService: DataService,
		private _spinnerService: SpinnerService,
		private _viewContainer: ViewContainerRef,
		private _questionsModalService: QuestionsModalService
	) {
		this.bIsLoading = false;
		this.bIsNext = false;
	}

	ngOnInit() {
		this.route.params.subscribe(params=> {
			this.strSlugId = params['slugId'];
		});
	}

	next() {
		if(this.bIsNext) {
			this._spinnerService.start();
			let postData = {
				code: 200,
				data: {
					slug: this.strSlugId,
					call: 'postPhotos'
				}
			};

			this._dataService.post('v1/data/question', postData)
				.subscribe((res: any) => {
					this._spinnerService.stop();

					if(res.hasOwnProperty('question') && res['question'].length > 0 && res['numbersOfQuestions'] > 0) {
						this._questionsModalService.openDialog(res, 'postPhotos', this._viewContainer)
							.then((dialog: any) => {
								(dialog as any).result.then((returnData: any) => {
									this.router.navigate(['/estimate', this.strSlugId]);
								});
							});
					} else {
						this.router.navigate(['/estimate', this.strSlugId]);
					}
				}, (error: any) => console.error('Unable to fetch brands', error));
		}
	}

	getData(event: any) {
		this.nTotoalStep = event.totalStep;
		this.nCurrentStep = event.currentStep;
		this.bIsLoading = true;
	}

	getStepStatus(event: any) {
		if(event) {
			this.bIsNext = true;
		} else {
			this.bIsNext = false;
		}
	}
}

