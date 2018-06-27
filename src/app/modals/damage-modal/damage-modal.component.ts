import { Component,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
  OnInit } from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { ActivatedRoute }            from '@angular/router';
import { DamageModalContent }        from './damage-modal-content.component';
import { DataService }            	 from '../../services/data.service';
import { StoreService }           	 from '../../services/store.service';
import { EventService }           	 from '../../services/event.service';
import { SpinnerService }         	 from '../../utilities/spinner/spinner.service';
import { DamageLocationComponent } 	 from '../../utilities/damage-location/damage-location.component';
declare var $: any;

@Component({
  selector: 'app-damage-modal',
  templateUrl: './damage-modal.component.html',
  styleUrls: ['./damage-modal.component.css']
})

export class DamageModalComponent implements ModalComponent<DamageModalContent>, OnInit {
    @Output() onClose: EventEmitter<any> = new EventEmitter();
    @ViewChild(DamageLocationComponent) myDamageLocation: DamageLocationComponent;
    context: DamageModalContent;

    imageMap: any;
    modalE: any = null;
    selectedImg: any;
    damageQuestionData: any;
    host: any;

    objDamageData: Object;

    bIsSelectedDamageLocation: boolean;
    bIsTextQuestionType: boolean;
    bIsNextStatus: boolean;
    
    nAutoPartID: number;
    nQuestionType: number; // question type in pop modal
    nLevelMin: number;
    nLevelMax: number;
    nDamageLevel: number;
    nQuestionOption: number;
    nSelectedQuestionId: number;
    nImgLoadCount: number;
    nLoadImgTotal: number;
    nPreviousQuestionType: number; // previous question type
    nSelectedLevel: number; // the level selected by clicking the damage image

    strHelperContent: string; // helper content
    strSlug: string;
    strModalHeader: string;
    strModalDescription: string;

    arrObjDamageList: Object[];
    arrIntDamageLocations: number[];

    constructor(
      public dialog: DialogRef<DamageModalContent>,
      private _dataService: DataService,
      private _storeService: StoreService,
      private route: ActivatedRoute,
      private _spinner: SpinnerService,
      private _rootNode: ElementRef,
      private _eventService: EventService
    ) {
      this.damageQuestionData = {
        answer:'',
        message: '',
        callback: ''
      };
      this.context                = dialog.context;
      this.nAutoPartID            = dialog.context.autoPartID;
      this.imageMap               = dialog.context.carMap.carImgMap;
      this.strSlug                = this.context['carMap']['slug'];
      this.nQuestionType          = 0;
      this.nLevelMin              = 0;
      this.nLevelMax              = 0;
      this.nImgLoadCount          = 0;
      this.nLoadImgTotal          = 0;
      this.nQuestionOption        = -1;
      this.nDamageLevel           = -1;
      this.nSelectedLevel         = -1;
      this.nPreviousQuestionType  = -1;
      this.arrIntDamageLocations     = [];
      this.strHelperContent       = '';
      this.objDamageData             = {};
      this.bIsSelectedDamageLocation = false;
      this.bIsNextStatus = false;
    }

	ngOnInit() {
		this.modalE = $(this._rootNode.nativeElement).closest('.modal');
		this.hideModal();

		if(!this.strSlug) {
			console.log('Slug id is not existied.');
			this.dialog.close();
		} else {
			let postData = {
				code: 200,
				data: {
					slug: this.strSlug,
					autoPartID: this.nAutoPartID
				}
			};

			this._dataService.post('v1/data/autopart', postData)
				.subscribe((res: any) => {
					this.host = this._dataService.host;
					if(res.data.callback === 'saveautopartquestion') {
						this.damageQuestionData = res.data;
						if((this.damageQuestionData as any).answer[0].img) {
							this.bIsTextQuestionType = false;
							this.nSelectedQuestionId = -1;
						} else {
							this.bIsTextQuestionType = true;
						}
						this.nQuestionType = 3;
					} else {
						this.arrObjDamageList = res.data.option;
						this.selectedImg = this.arrObjDamageList[0];
						this.strModalHeader = res.data.header;
						this.strModalDescription = res.data.desc;
						this.nQuestionType = 1;
						this.nLoadImgTotal = this.arrObjDamageList.length;
						let answers = res.data.option.map((element: any) => {
							return element.answer;
						});
						let result = this.getMinMax(answers);
						this.nLevelMin = result[0];
						this.nLevelMax = result[1];
						this.nSelectedLevel = parseInt(res.data.selected);
						this.displayCurrentStep(this.nSelectedLevel);
					}

					this.showModal();
				}, (error: any) => console.error('Unable to fetch brands', error));
		}
	}

    getMinMax(data: number[]) {
      let max = Math.max.apply(Math, data);
      let min = Math.min.apply(Math, data);
      return [min, max];
    }

    hideModal(count=0) {
      if(this.modalE.length <= 0) {
        count ++;
        let that = this;
        setTimeout(function() {
          that.hideModal(count);
        });
      } else if(count>50) {
        console.log('Fail to loading the modal.');
      } else {
        this._spinner.start();
        this.modalE.hide();
      }
    }

    showModal() {
      this.modalE.show();
      this._spinner.stop();
    }

    closeModal() {
      this.context.carMap.markList.splice(-1, 1);
      this.dialog.close();
    }

    onChangeSlider(event: any) {
      this.displayCurrentStep((event as any).value);
    }

    /*
    display available step
    params:
    - level: damage level(counter) 
    */
    displayCurrentStep(level: number, count: number = 0) {
      this.nSelectedLevel = level;
      let stepClass = '#damage_modal .step';
      let availableStepClass = stepClass + '.step';
      availableStepClass += level;
      if($(stepClass).length <= 0) {
        count ++;
        let that = this;
        setTimeout(function() {
          that.displayCurrentStep(level, count);
        }, 50);
      } else if(count>50) {
        console.log('Fail to loading the step damage images.');
      } else {
        $(stepClass).hide();
        $(availableStepClass).show();
      }

    }

    /*
    go to next level of damaged images
    params:
    - level: damage level 
    */
    nextLevel(level: number) {
      level ++;
      if(level > this.nLoadImgTotal) {
        level = this.nLevelMin;
      } else {
        level += this.nLevelMin;
      }
      this.displayCurrentStep(level);
    }

    /*
    go to previous level of damaged images
    params:
    - level: damage level 
    */
    previousLevel(level: number) {
      level --;
      if(level < 0) {
        level = this.nLevelMax;
      } else {
        level += this.nLevelMin;
      }
      this.displayCurrentStep(level);
    }

    /*
    show helper text
    params:
    - level: damage level 
    */
    helper() {
      this.nPreviousQuestionType = this.nQuestionType;
      this.nQuestionType = 4;
      this.strHelperContent = (this.arrObjDamageList[this.nSelectedLevel - 1] as any).help;
    }

    /*
    close helper modal
    params:
    - questionType: previous question type 
    */
    closeHelper(questionType: number = 0) {
      if(questionType === 0) {
        this.nQuestionType = this.nPreviousQuestionType;
      } else {
        this.nQuestionType = questionType;
      }

      this.displayCurrentStep(this.nSelectedLevel);
    }

    loadImg() {
      this.nImgLoadCount ++;
      if(this.nImgLoadCount >= this.nLoadImgTotal) {
        this.nImgLoadCount = 0;
      }
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

    clickDoorDamage(door: Object, index: number) {console.log(index);
      this.selectedImg = door;

      this.nDamageLevel = (door as any).answer;
      $('.autopart-area > .step').css('border', 'none');
      this.nPreviousQuestionType = this.nQuestionType;
      this.nQuestionType = 5;
    }

    damageFinalized() {
      this.hideModal();
      this.nQuestionType = 0;
      let postData = {
        code: 200,
        data: {
          slug: this.strSlug,
          autoPartID: this.nAutoPartID,
          damageLevel: this.nDamageLevel
        }
      };

      this._dataService.post('v1/data/savedamagelevel', postData)
        .subscribe((res: any) => {
          if(res.data.callback === 'saveautopartquestion') {
            if(res.data.message === 'No more questions.') {
              this.dialog.close();
              this.waitForDMClose(1);
            } else {
              this.nQuestionType = 3;
            }
          } else {
            this.nQuestionType = 2;
            this.objDamageData = res;
            this.strModalHeader = res.data.header;
            this.strModalDescription = res.data.desc;
            this.host = this._dataService.host;
          }
          this.showModal();
        }, (error: any) => console.error('Unable to fetch brands', error));
    }

    /*
    insert the answer to the list
    */
    insertAnswerToList($event: any) {
      for(let i = 0; i < this.arrIntDamageLocations.length; i++) {
        if($event.id === (this.arrIntDamageLocations[i] as any).id) {
          this.arrIntDamageLocations.splice(i, 1);
          return false;
        }
      }

      this.arrIntDamageLocations.push($event);
      return true;
    }

    /*
    get answer by clicking answer
    */
    getLocationAnswer($event: any) {
      this.insertAnswerToList($event);
      this.myDamageLocation.updateLocation(this.arrIntDamageLocations);

      if(this.arrIntDamageLocations.length > 0) {
        this.bIsSelectedDamageLocation = true;
        this.bIsNextStatus = true;
      } else {
        this.bIsSelectedDamageLocation = false;
        this.bIsNextStatus = false;
      }
    }

    damageAreaFinalized() {
      this.hideModal();
      let damageLocationAnswerArray: any[] = [];
      for(let i = 0; i < this.arrIntDamageLocations.length; i ++) {
        let resItem = <any>{};
        resItem['id'] = (this.arrIntDamageLocations[i] as any).answer['data']['Answer'];
        if((this.arrIntDamageLocations[i] as any).answer['intersect']) {
          resItem['intersects'] = (this.arrIntDamageLocations[i] as any).answer['intersect'];
        }
        damageLocationAnswerArray.push(resItem);
      }

      let postData = {
        code: 200,
        data: {
          slug: this.strSlug,
          autoPartId: this.nAutoPartID,
          damageLocation: damageLocationAnswerArray
        }
      };

      this._dataService.post('v1/data/savedamagelocation', postData)
        .subscribe((res: any) => {
          this.damageQuestionData = res.data;
          if(this.damageQuestionData.message === 'No more questions.') {
            this.dialog.close();
            this.waitForDMClose(0);
          } else {
            this.nQuestionType = 3;
            if((this.damageQuestionData as any).answer[0].img) {
              this.bIsTextQuestionType = false;
              this.nSelectedQuestionId = -1;
            } else {
              this.bIsTextQuestionType = true;
            }
          }

          this._eventService.emit('take_damage_screenshot', {
            slug: res.data.slug,
            autoPartId: this.nAutoPartID
          });
          this.showModal();
        }, (error: any) => console.error('Unable to fetch brands', error));
    }

    // wait for closing the damage modal
    waitForDMClose(nType:number, count: number = 0) {
      if(count > 30) {
        console.log('Timeout to wait for the damage modal close event');
      } else if(!this.context.carMap._damageModalService.bClose) {
        count ++;
        setTimeout(() => this.waitForDMClose(nType, count), 50);
      } else {
        if(nType === 0) {
          this.imageMap.displayCheckMark();
        } else {
          this.imageMap.updatePolygon(this.context.carMap.markList);
          this.imageMap.displayCheckMark();
        }
      }
    }

    selectAnswer(id: any) {
      this.nQuestionOption = id;
      this.nSelectedQuestionId = id;
    }

    onChangeState(event: any) {
      if((event as any).currentValue) {
        this.nQuestionOption = this.getQuestionId('yes');
      } else {
        this.nQuestionOption = this.getQuestionId('no');
      }
    }

    getQuestionId(state: string) {
      let answerList = (this.damageQuestionData as any).answer.filter(function(e: any) {
        return e.text.toLowerCase() === state;
      });

      return (answerList[0] as any).id;
    }

    damageQuestionsFinalized(funcName: string) {
      this.hideModal();
      this.nQuestionType = 0;
      let postData = {
        code: 200,
        data: {
          slug: this.strSlug,
          autoPartId: this.nAutoPartID,
          questionId: this.damageQuestionData.questionId,
          answerId: this.nQuestionOption,
          claimDamageQuestionId: this.damageQuestionData.claimDamageQuestionId
        }
      };

      this._dataService.post('v1/data/saveautopartquestion', postData)
        .subscribe((res: any) => {
          this.showModal();
          this.damageQuestionData = res.data;
          if(this.damageQuestionData.message === 'No more questions.') {
            this.dialog.close();
            this.waitForDMClose(1);
          } else {
            this.nQuestionType = 3;
            this.nQuestionOption = -1;
          }
        }, (error: any) => console.error('Unable to fetch brands', error));
    }
}
