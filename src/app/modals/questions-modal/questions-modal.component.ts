import { Component, OnInit } from '@angular/core';
import { DialogRef,
    ModalComponent } from 'ngx-modialog';
import { FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { QuestionsModalContent } from './questions-modal-content.component';
import { DataService }           from '../../services/data.service';

@Component({
	selector: 'app-questions-modal',
	templateUrl: './questions-modal.component.html',
	styleUrls: ['./questions-modal.component.css']
})
export class QuestionsModalComponent implements ModalComponent<QuestionsModalContent>, OnInit {
	context: QuestionsModalContent;
	questionForm: FormGroup;
	objQuestionOptions: Object;

	bIsLoad: boolean;
	strSlug: string;
	strCall: string;
	arrQuestions: Object[];

	constructor(
		public dialog: DialogRef<QuestionsModalContent>,
		private _dataService: DataService
	) {
		this.context = dialog.context;
		this.strCall = this.context.strCall;
		this.bIsLoad = false;
	}

	ngOnInit() {
		this.createForm(this.context.objData);
	}

	createForm(res: Object) {
		this.strSlug = res['data']['slug'];
		this.arrQuestions = res['question'];

		if(this.arrQuestions && this.arrQuestions.length > 0) {
			this.questionForm = new FormGroup({});
			this.objQuestionOptions = <any>{};

			for(let q = 0; q < this.arrQuestions.length; q ++) {
				let question = this.arrQuestions[q];

		    	if(question.hasOwnProperty('variable')) {
					if(!this.objQuestionOptions.hasOwnProperty(question['variable'])) {
						let arrAnswers = [];
						let control: FormControl = new FormControl(null, [
							<any>Validators.required
						]);

						if(question.hasOwnProperty('answer') && question['answer'].length > 0 && question['answer_type'] === 'select') {
							for(let i = 0; i < question['answer'].length; i ++) {
								let answer  = question['answer'][i];
								arrAnswers.push({value: answer['id'], label: answer['text']});
							}

							this.objQuestionOptions[question['variable']] = arrAnswers;
							this.questionForm.addControl(question['variable'], control);
							this.questionForm.controls[question['variable']].setValue(arrAnswers[0]['value']);
						} else {
							this.questionForm.addControl(question['variable'], control);
						}
					}
		    	}
		    }

		    this.bIsLoad = true;
		} else {
			this.dialog.close();
		}
	}

	onCancel(event: any) {
		event.preventDefault();
		this.dialog.close();
	}

	onSubmitForm() {
		this.bIsLoad = false;
		let arrAnswers = [];

		for(let key in this.questionForm['value']) {
			arrAnswers.push({[key]: this.questionForm['value'][key]});
		}

		let postData = {
			code: 200,
			data: {
				slug: this.strSlug,
				call: this.strCall,
				answers: arrAnswers
			}
		};

		this._dataService.post('v1/data/question', postData)
			.subscribe((res: any) => {
				if(res.hasOwnProperty('question') && res['question'].length > 0) {
					this.createForm(res);
				} else {
					this.dialog.close();
				}
				
			}, (error: any) => console.error('Unable to fetch brands', error));
	}

}
