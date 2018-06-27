import { Component,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  OnInit } from '@angular/core';
import { CoordiateModel, CanvasStyleModel }  from '../../core/models';
import { ImageMapComponent }  from '../image-map/image-map.component';

/**
 * This class represents the lazy loaded CarMapComponent.
 */

@Component({
  selector: 'damage-location',
  templateUrl: './damage-location.component.html',
  styleUrls: ['./damage-location.component.css']
})

export class DamageLocationComponent implements OnInit {
  @ViewChild(ImageMapComponent) myImgMapHandler: ImageMapComponent;
  @Input() damageLocationData: Object;
  @Input() bIsNextStatus: boolean;
  @Output() getAnswerId = new EventEmitter();
  @Output() loadImage = new EventEmitter();
  locationMapData: Object;
  locationMapStyle: CanvasStyleModel;
  locationLoading: boolean;

  ngOnInit() {
    this.locationMapData = this.damageLocationData;
    this.locationLoading = true;
    this.locationMapStyle = new CanvasStyleModel();
    this.locationMapStyle.bgColor = 'blue';
    this.locationMapStyle.bgOpacity = 0.75;
    this.locationMapStyle.borderColor = 'black';
    this.locationMapStyle.borderWidth = 2;
    this.locationMapStyle.bgOverColor = 'blue';
    this.locationMapStyle.bgOverOpacity = 0.5;
    this.locationMapStyle.borderOverColor = 'black';
    this.locationMapStyle.borderOverWidth = 2;
  }

  /*
  click event on canvas
  */
  clickOnImage($event: any) {
    let value = ($event as any).value;
    let id = ($event as any).id;
    this.getAnswerId.emit({
      answer: value,
      id: id
    });
  }

  /*
  delete the select location
  */
  updateLocation(locationList: any[]) {
    this.myImgMapHandler.updatePolygon(locationList);
  }

  loadedImage() {
    this.loadImage.emit();
  }
}
