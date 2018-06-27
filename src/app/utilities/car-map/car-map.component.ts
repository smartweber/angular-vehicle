import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  OnInit,
  OnChanges,
  OnDestroy,
  Renderer,
  EventEmitter,
  ViewContainerRef } from '@angular/core';
import { Router }              from '@angular/router';
import { CanvasStyleModel }    from '../../core/models';
import { environment }         from '../../../environments/environment';
import { DataService }         from '../../services/data.service';
import { EventService }        from '../../services/event.service';
import { ImageMapComponent }   from '../image-map/image-map.component';
import { ConfirmModalService } from '../../modals/confirm-modal/confirm-modal.service';
import { DamageModalService }  from '../../modals/damage-modal/damage-modal.service';

/**
 * This class represents the lazy loaded CarMapComponent.
 */

@Component({
	selector: 'car-map',
	templateUrl: './car-map.component.html',
	styleUrls: ['./car-map.component.css']
})

export class CarMapComponent implements OnInit, OnChanges, OnDestroy {
	@ViewChild(ImageMapComponent) carImgMap:ImageMapComponent;
	@Output() checkBookMark       = new EventEmitter();
	@Output() showNextSeverity    = new EventEmitter();
	@Output() eventChangeLocation = new EventEmitter();
	@Output() initEventData       = new EventEmitter();
	@Input('slug') slug: string;
	@Input('mapData') mapData: any;

	backendApi: string;
	carMapStyle: CanvasStyleModel;
	markList: any[];

	constructor(
		private el: ElementRef,
		private router: Router,
		private renderer: Renderer,
		private _dataService: DataService,
		private _eventService: EventService,
		private _viewContainer: ViewContainerRef,
		private _damageModalService: DamageModalService,
		private _confirmModalService: ConfirmModalService
	) {
		this.backendApi = environment.API;
	}

	ngOnInit() {}

	ngOnChanges() {
		this.initComponent();
	}

	ngOnDestroy() {
		if(this._confirmModalService) {
			this._confirmModalService.closeDialog();
		}

		if(this._damageModalService) {
			this._damageModalService.closeDialog();
		}
	}

	initComponent() {
		this.carMapStyle = new CanvasStyleModel();

		this.carMapStyle.bgColor = 'red';
		this.carMapStyle.bgOpacity = 0.6;
		this.carMapStyle.borderColor = 'black';
		this.carMapStyle.borderWidth = 1;
		this.carMapStyle.bgOverColor = 'blue';
		this.carMapStyle.bgOverOpacity = 0.6;
		this.carMapStyle.borderOverColor = 'black';
		this.carMapStyle.borderOverWidth = 1;
		this.markList = [];
	}

	/*
	insert the mark to the list
	*/
	insertMarkToList($event: any) {
		for(let i=0; i<this.markList.length; i++) {
			if($event.id === this.markList[i].id) {
				return i;
			}
		}

		this.markList.push($event);
		return -1;
	}

	/*
	init mark list from the api
	*/
	initMarkList(event: any) {
		if(event.length > 0) {
			this.markList = event;
			this.initEventData.emit(true);
		} else {
			this.markList = [];
			this.initEventData.emit(false);
		}
	}

	/*
	click event on canvas
	*/
	clickOnImage($event: any) {
		let check = this.insertMarkToList($event);
		if(check !== -1) {
			this._confirmModalService.openDialog(this, check, this._viewContainer);
			return;
		}
		let value = ($event as any).value;
		let autoPartId = (value as any).AutoPartID;
		this._damageModalService.openDialog(autoPartId, this, this._viewContainer);
	}

	doneAutoPart(list = this.markList) {
		if(list.length > 0) {
			this.checkBookMark.emit(true);
		} else {
			this.checkBookMark.emit(false);
		}
	}

	selectAutoPart(event: any) {
		this.showNextSeverity.emit(event);
	}

	eventSwitchLocation(event: any) {
		this.eventChangeLocation.emit(event);
	}
}
