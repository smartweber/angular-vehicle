import {
  Component,
  ElementRef,
  Input,
  Output,
  OnInit,
  OnDestroy,
  OnChanges,
  Renderer,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  EventEmitter }         from '@angular/core';
import { Router }        from '@angular/router';
import { CoordiateModel,
  CanvasStyleModel }     from '../../core/models';
import { environment }   from '../../../environments/environment';
import { DataService }   from '../../services/data.service';
import { EventService }  from '../../services/event.service';


/**
 * This class represents the lazy loaded ImageMapComponent.
 */

@Component({
  moduleId: module.id,
  selector: 'image-map',
  templateUrl: './image-map.component.html',
  styleUrls: ['./image-map.component.css']
})

export class ImageMapComponent implements  OnInit, OnDestroy, OnChanges, AfterViewChecked {
  @Input() mapData: Object;
  @Input() mapStyle: CanvasStyleModel;
  @Input() bCarmap: boolean;
  @Input() bIsNextStatus: boolean;
  @Input() bPreShowDamages: boolean;
  @Output() clickOnImage        = new EventEmitter();
  @Output() doneAutoPart        = new EventEmitter();
  @Output() selectAutoPart      = new EventEmitter();
  @Output() loadImage           = new EventEmitter();
  @Output() eventSwitchLocation = new EventEmitter();
  @Output() initMarkList        = new EventEmitter();

  @ViewChild('mapContainer') mapContainer: any;

  

  mapCanvas: any;
  effectCanvas: any;

  bIsMapImgLaod: boolean;
  bIsLoadFont: boolean;
  bIsOutlineMethod: boolean;
  bIsColumnMethod: boolean;
  bIsSelected: boolean;
  bIsLocation: boolean;
  bIsStartCalculate: boolean;

  strMapImg: string;
  strImageMapId: string;
  strImageId: string;
  strImageCanvasId: string;
  strEffectCanvasId: string;
  strImgSrc: string;
  strApiUrl: string;

  nCanvasToimageRateW: number;
  nCanvasToimageRateH: number;
  nCurrentSPIndex: number; // current selected polygon index
  nCurrentDamageIndex: number;
  nMapH: number;
  nMapW: number;
  nDescW: number;
  nSelectedSection: number;
  nLeftSlideCounter: number;
  nCenterSlideCounter: number;
  nRightSlideCounter: number;

  objMapRatio: CoordiateModel;

  arrObjLocations: Object[];
  mapList: any[];
  leftSliders: any[];
  rightSliders: any[];
  selectedPolygonList: any[];

  constructor(
    private el: ElementRef,
    private router: Router,
    private _dataService: DataService,
    private _eventService: EventService,
  	private renderer: Renderer,
    protected _changeDetectorRef:ChangeDetectorRef
  ) {
    this.nCurrentSPIndex = -1;
    this.nCurrentDamageIndex = -1;
    this.nMapH = 0;
    this.nMapW = 0;
    this.nDescW = 0;
    this.nSelectedSection = 0;
    this.nLeftSlideCounter = 0;
    this.nCenterSlideCounter = 0;
    this.nRightSlideCounter = 0;

    this.bIsLoadFont = false;
    this.bIsOutlineMethod = false;
    this.bIsColumnMethod = false;
    this.bIsSelected = false;
    this.bIsLocation = false;
    this.bIsStartCalculate = false;

    this.leftSliders = [];
    this.rightSliders = [];
    this.arrObjLocations = [];
  }

  ngAfterViewChecked() {
    if(this.bPreShowDamages && this.bIsStartCalculate) {
      if(Math.abs(this.nMapH - this.mapContainer.nativeElement.offsetHeight) > 5) {
        this.getMapContainerSize();
        this._changeDetectorRef.detectChanges();
      }
    }
  }

  ngOnInit() {
    this.bIsMapImgLaod = false;
    this.strApiUrl =environment.API;
    this.selectedPolygonList = [];
    if(this.mapData) {
      this.objMapRatio = {
        x: (this.mapData as any)['data']['width'],
        y: (this.mapData as any)['data']['height']
      };
      this.mappingData(this.mapData);
      this.strImageMapId = this.uuid('0123456789abcdef');
      this.strImageId = this.strImageMapId + '_image_map';
      this.strImageCanvasId = this.strImageMapId + '_image_canvas';
      this.strEffectCanvasId = this.strImageMapId + '_effect_canvas';
    } else {
      console.log('Please refresh again to mapping image.');
    }

    if(!this.bPreShowDamages) {
      this._eventService.registerEvent('next_severity_event', this, (args: any) => {
        this.clickOnImage.emit({value: this.mapList[this.nCurrentSPIndex]['data'], id: this.nCurrentSPIndex});
      });
    } else {
      this._eventService.registerEvent('take_damage_screenshot', this, (args: any) => {
        let data = args[0];
        this.sendScreenshot(data['slug'], data['autoPartId']);
      });

      this.renderer.setElementStyle(this.el.nativeElement, 'display', 'flex');
    }
  }

  ngOnChanges() {
    this.mappingData(this.mapData);
  }

  ngOnDestroy() {
    if(!this.bPreShowDamages) {
      this._eventService.unregisterEvent('nex_severity_event', this);
    } else {
      this._eventService.unregisterEvent('take_damage_screenshot', this);
    }
  }

  /**
   * Draws a rounded rectangle using the current state of the canvas. 
   * If you omit the last three params, it will draw a rectangle 
   * outline with a 5 pixel border radius 
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number} x The top left x coordinate
   * @param {Number} y The top left y coordinate 
   * @param {Number} width The width of the rectangle 
   * @param {Number} height The height of the rectangle
   * @param {Number} radius The corner radius. Defaults to 5;
   * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
   * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
   */
  roundRect(ctx: any, x: number, y:number, width:number, height:number, radius:number=5, fill: boolean, stroke: boolean = true) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      ctx.fill();
    }
  }

  drawPlusIcon(
    x: number,
    y: number,
    bigSize: boolean,
    detail: boolean = false,
    detailText: string = '',
    checked: boolean = false,
    iconUrl: string = '') {

    let ctx = this.mapCanvas.getContext('2d');
    var metrics = ctx.measureText(detailText);
    let detailTextWidth = metrics.width;

    let imgStartX = x * this.nCanvasToimageRateW;
    let imgStartY = y * this.nCanvasToimageRateH;

    let bLeftSituation = false;

    if(this.mapCanvas.width/2 > imgStartX) {
      bLeftSituation = true;
    } else {
      bLeftSituation = false;
    }

    ctx.strokeStyle = '#017bff';
    ctx.fillStyle = 'rgba(255,255,255,1.0)';
    if(!detail) {
      this.roundRect(ctx, imgStartX, imgStartY, 20, 20, 10, true);
    } else {

      if(!bLeftSituation) {
        this.roundRect(ctx, (imgStartX-detailTextWidth-10), imgStartY, detailTextWidth+30, 20, 10, true);
        ctx.fillStyle = '#017bff';
        ctx.font='12px';
        ctx.fillText(detailText, (imgStartX + 8 - detailTextWidth - 10), imgStartY+14);
      } else {
        this.roundRect(ctx, imgStartX, imgStartY, detailTextWidth+30, 20, 10, true);
        ctx.fillStyle = '#017bff';
        ctx.font='12px';
        ctx.fillText(detailText, imgStartX+18, imgStartY+14);
      }

    }

    if(iconUrl && iconUrl !== '') {

      let ctxImg = this.mapCanvas.getContext('2d');
      let imgW = 14, imgH = 14;
      let circleSize = 20;
      let spaceSize = (circleSize - imgW) / 2;

      let img = new Image();
      img.src = iconUrl;
      let that = this;
      img.onload = function() {
        ctxImg.globalAlpha = 1;
        ctxImg.drawImage(img, imgStartX + spaceSize, imgStartY + spaceSize, imgW, imgH);
        that.bIsMapImgLaod = true;
      };

      img.onerror = function() {
        console.log('This image url is invalid: ' + img.src);
      };
    } else {
      let fontawesomeSize = ctx.measureText('\uF067').width;
      ctx.fillStyle = '#017bff';
      ctx.font='10px FontAwesome';
      this.checkReady(ctx, imgStartX, imgStartY, checked, fontawesomeSize);
    }

  }

  checkReady(
    ctx: any,
    imgStartX: number,
    imgStartY: number,
    checked: boolean,
    fontawesomeSize: number,
    count: number = 0) {
    let currentFontawesomeSize = ctx.measureText('\uF067').width;

    if(count > 20) {
      console.log('Time out to load the font awesome.');
    } else if(!this.bIsLoadFont && currentFontawesomeSize === fontawesomeSize) {
      count ++;
      setTimeout(() => this.checkReady(ctx, imgStartX, imgStartY, checked, currentFontawesomeSize, count), 100);
    } else {
      if(!checked) {
        ctx.fillText('\uF067', imgStartX+6, imgStartY+15);
      } else {
        ctx.fillText('\uF00C', imgStartX+6, imgStartY+15);
      }
      this.bIsLoadFont = true;
    }
  }


  /*
  mapping back end data to local variable
  */
  mappingData(res:any) {
    let arrSelectedMapList: any[] = [];

    if(this.bPreShowDamages) { // damage modal

      let mapList = res.data.map;
      this.strMapImg = res.data.img;
      this.strImgSrc = this.strApiUrl + this.strMapImg;
      this.mapList = [];
      let indexCounter = 0;

      // catch coordinates from api
      for(let item in mapList) {
        let parentPolygon: CoordiateModel[] = [];
        let parentObject = <any>{};
        let polygonIndex: number;
        parentObject['parentData'] = mapList[item];

        mapList[item].Coordinates.split(',').forEach(function(e: any, i: number) {
          if(i%2 === 0) {
            polygonIndex = i/2;
            parentPolygon[polygonIndex] = new CoordiateModel();
            parentPolygon[polygonIndex].x = parseInt(e);
          } else {
            parentPolygon[polygonIndex].y = parseInt(e);
          }
        });

        parentObject['parentPolygons'] = parentPolygon;
        parentObject['index'] = indexCounter;

        if(mapList[item]['Title']==='Bound Box' && mapList[item]['child']) { // bounding box
          parentObject['child'] = [];

          for(let childItem in mapList[item]['child']) {
            let childNewItem = <any>{};
            indexCounter ++;
            let childPolygon: CoordiateModel[] = [];
            let childPolygonIndex: number;

            mapList[item]['child'][childItem].Coordinates.split(',').forEach(function(childE: any, childI: number) {
              if(childI%2 === 0) {
                childPolygonIndex = childI/2;
                childPolygon[childPolygonIndex] = new CoordiateModel();
                childPolygon[childPolygonIndex].x = parseInt(childE);
              } else {
                childPolygon[childPolygonIndex].y = parseInt(childE);
              }
            });

            childNewItem['data'] = mapList[item]['child'][childItem];
            childNewItem['polygons'] = childPolygon;
            childNewItem['index'] = indexCounter;
            parentObject['child'].push(childNewItem);

          }

          if(mapList[item]['sub']) {
            parentObject['sub'] = [];

            for(let subItem in mapList[item]['sub']) {
              let subNewItem = <any>{};
              let subPolygon: CoordiateModel[] = [];
              let subPolygonIndex: number;

              mapList[item]['sub'][subItem].Coordinates.split(',').forEach(function(subE: any, subI: number) {
                if(subI%2 === 0) {
                  subPolygonIndex = subI/2;
                  subPolygon[subPolygonIndex] = new CoordiateModel();
                  subPolygon[subPolygonIndex].x = parseInt(subE);
                } else {
                  subPolygon[subPolygonIndex].y = parseInt(subE);
                }
              });

              subNewItem['data'] = mapList[item]['sub'][subItem];
              subNewItem['polygons'] = subPolygon;
              parentObject['sub'].push(subNewItem);
            }
          }

        }

        this.mapList.push(parentObject);
        indexCounter ++;
      }
    } else {
      if(res.data.hasOwnProperty('locations') && res.data['locations'].length > 0) {
        this.arrObjLocations = res.data['locations'];
        this.bIsLocation = true;
      } else {
        this.bIsLocation = false;
      }

      if(res['data']['method']=== 'outline') {
        this.bIsOutlineMethod = true;
        this.mapList = [];
        let mapList = res.data.map;
        this.strMapImg = res.data.img;
        this.strImgSrc = this.strApiUrl + this.strMapImg;
        let nListIndex = 0;

        // catch coordinates from api
        for(let item in mapList) {
          let marker: number[] = [];
          let polygon: CoordiateModel[] = [];
          let polygonIndex: number;

          mapList[item].Coordinates.split(',').forEach(function(e: any, i: number) {
            marker.push(parseInt(e));
            if(i%2 === 0) {
              polygonIndex = i/2;
              polygon[polygonIndex] = new CoordiateModel();
              polygon[polygonIndex].x = parseInt(e);
            } else {
              polygon[polygonIndex].y = parseInt(e);
            }
          });

          this.mapList.push({
            polygon: polygon,
            data: mapList[item],
            index: nListIndex,
            selected: (mapList[item]['complete'] === 1) ? true : false
          });

          nListIndex ++;
        }
      } else if(res['data']['method']=== 'columns') {
        arrSelectedMapList = [];
        this.mapList = [];
        let mapList = res.data.map;
        this.strMapImg = res.data.img;
        this.strImgSrc = this.strApiUrl + this.strMapImg;
        let nListIndex = 0;
        // catch coordinates from api
        for(let item in mapList) {
          let marker: number[] = [];
          let polygon: CoordiateModel[] = [];
          let polygonIndex: number;

          mapList[item].Coordinates.split(',').forEach(function(e: any, i: number) {
            marker.push(parseInt(e));
            if(i%2 === 0) {
              polygonIndex = i/2;
              polygon[polygonIndex] = new CoordiateModel();
              polygon[polygonIndex].x = parseInt(e);
            } else {
              polygon[polygonIndex].y = parseInt(e);
            }
          });

          this.mapList.push({
            polygon: polygon,
            data: mapList[item],
            index: nListIndex,
            selected: (mapList[item]['complete'] === 1) ? true : false
          });

          if(mapList[item]['complete'] === 1) {
            arrSelectedMapList.push({
              value: mapList[item],
              id: nListIndex
            });
          }

          nListIndex ++;
        }
        this.bIsOutlineMethod = true;
        this.bIsColumnMethod = true;
      } else {
        this.bIsOutlineMethod = false;
        this.mapList = [];
        let mapList = res.data.top_map;
        let nListIndex = 0;

        for(let item in mapList) {
          this.mapList.push({
            data: mapList[item],
            index: nListIndex,
            selected: (mapList[item]['complete'] === 1) ? true : false
          });

          nListIndex ++;
        }

        this.strMapImg = res.data.top_img;
        this.strImgSrc = this.strApiUrl + this.strMapImg;
      }
    }

    this.bIsMapImgLaod = true;

    if(this.mapList) {
      this.loadCarImage();

      if(this.bIsColumnMethod) {
        this.initMarkList.emit(arrSelectedMapList);
      }

      if(!this.bPreShowDamages && this.bIsColumnMethod) {
        this.getSliderData();
      }
    } else {
      console.log('The map list data is not loaded.');
    }
  }


  getSliderData() {
    this.leftSliders = [];
    this.rightSliders = [];

    switch (this.nSelectedSection) {
      case 0:
        // driver slider
        this.leftSliders = this.mapList.filter((item: any) => {
          return (item.data.section === this.nSelectedSection) && (item.data.side === 'left');
        });
        break;

      case 1:
        // center
        this.leftSliders = this.mapList.filter((item: any) => {
          return (item.data.section === this.nSelectedSection) && (item.data.side === 'left');
        });

        this.rightSliders = this.mapList.filter((item: any) => {
          return (item.data.section === this.nSelectedSection) && (item.data.side === 'right');
        });
        break;

      case 2:
        // passenger slider
        this.rightSliders = this.mapList.filter((item: any) => {
          return (item.data.section === this.nSelectedSection) && (item.data.side === 'right');
        });
        break;

      default:
        console.log('The slider type is not existed');
        break;
    }
  }

  loadImg() {
    this.loadImage.emit();
  }

  /*
  create id
  */
  uuid(key: string = '0123456789abcdef') {
    var chars = key.split('');

    let uuid: any[] = [], rnd = Math.random, r: any;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4'; // version 4

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | rnd()*16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r & 0xf];
      }
    }

   return uuid.join('');
  }

  //+++

  // checkPolygonSize(polygonList: CoordiateModel[]) {
  //   let min = polygonList[0].x + polygonList[0].y;
  //   let max = polygonList[0].x + polygonList[0].y;
  //   let minId = 0;
  //   let maxId = 0;

  //   for(let i=0; i<polygonList.length; i++) {
  //     if(min > (polygonList[i].x + polygonList[i].y)) {
  //       min = polygonList[i].x + polygonList[i].y;
  //       minId = i;
  //     }

  //     if(max < (polygonList[i].x + polygonList[i].y)) {
  //       max = polygonList[i].x + polygonList[i].y;
  //       maxId = i;
  //     }
  //   }

  //   if(max-min > 80) {
  //     return true;
  //   } else {
  //     return false;
  //   }

  // }

  //+++

  /*
  draw all damage area
  */
  drawAllDamageArea() {
    let ctx = this.mapCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);

    if(this.bPreShowDamages) { //damage modal
      let style: Object;

      if((this.mapData as any).data.overlapAlpha &&
        (this.mapData as any).data.overlapColor) {
        style = {
          bgColor: (this.mapData as any).data.overlapColor,
          borderColor: 'black',
          bgOpacity: (this.mapData as any).data.overlapAlpha,
          borderWidth: 2
        };
      } else {
        style = {
          bgColor: 'blue',
          borderColor: 'black',
          bgOpacity: 0.1,
          borderWidth: 2
        };
      }

      this.drawDamagePolygons(this.mapCanvas, style);
    } else { //outline, column and icon methods
      if(this.bIsOutlineMethod) {
        this.updateCheckMark();
      } else {
        this.drawDamageIcons(this.bIsLoadFont);
      }
    }
  }

  /*
  check if the current index is inside the selected polygon list
  */
  checkPolygonIndex(index: number) {
    for(let i=0; i<this.selectedPolygonList.length; i++) {
      if(this.selectedPolygonList[i]['id'] === index) {
        return true;
      }
    }

    return false;
  }

  /*
  draw entire damage polygons with limited rule
  */
  drawDamagePolygons(
    canvas: any,
    style: Object
  ) {
    let selectedStyle: Object;

    if((this.mapData as any).data.highlightAlpha &&
      (this.mapData as any).data.highlightColor) {
      selectedStyle = {
        bgColor: (this.mapData as any).data.highlightColor,
        borderColor: this.mapStyle.borderColor,
        bgOpacity: (this.mapData as any).data.highlightAlpha,
        borderWidth: this.mapStyle.borderWidth
      };
    } else {
      selectedStyle = {
        bgColor: this.mapStyle.bgColor,
        borderColor: this.mapStyle.borderColor,
        bgOpacity: this.mapStyle.bgOpacity,
        borderWidth: this.mapStyle.borderWidth
      };
    }
    let ctx = canvas.getContext('2d');
    let canvasStyle: Object;

    for(let i=0; i<this.mapList.length; i++) {
      let item = this.mapList[i];
      if(item['parentData']['Title'] === 'Bound Box') {
        // save the unclipped context
        ctx.save();

        // define the path that will be clipped to
        ctx.beginPath();
        for(let c=0; c<item['parentPolygons'].length; c++) {
          if(c === 0) {
            ctx.moveTo(item['parentPolygons'][c]['x']*this.nCanvasToimageRateW, item['parentPolygons'][c]['y']*this.nCanvasToimageRateH);
          } else {
            ctx.lineTo(item['parentPolygons'][c]['x']*this.nCanvasToimageRateW, item['parentPolygons'][c]['y']*this.nCanvasToimageRateH);
          }
        }

        ctx.closePath();

        // stroke the path
        // half of the stroke is outside the path
        // the outside stroke will survive the clipping that follows
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle= 'black';
        ctx.lineWidth=2;
        ctx.stroke();

        // make the current path a clipping path
        ctx.clip();

        // draw the image which will be clipped except in the clipping path
        for(let j=0; j<item['child'].length; j++) {
          let bSelected = this.checkPolygonIndex(item['child'][j]['index']);

          if(bSelected) {
            canvasStyle = selectedStyle;
          } else {
            canvasStyle = style;
          }

          this.drawPolygons(this.mapCanvas, item['child'][j]['polygons'], canvasStyle);
        }

        // restore the unclipped context (==undo the clipping path)
        ctx.restore();
      } else {
        let bSelected = this.checkPolygonIndex(item['index']);

        if(bSelected) {
          canvasStyle = selectedStyle;
        } else {
          canvasStyle = style;
        }

        this.drawPolygons(this.mapCanvas, item['parentPolygons'], canvasStyle);
      }
    }
  }

  getMapContainerSize() {
    let $img = document.getElementById(this.strImageId);
    let nMapElementW = this.mapContainer.nativeElement.offsetWidth;
    let nMapElementH = this.mapContainer.nativeElement.offsetHeight;

    if(this.bPreShowDamages) { // damage modal
      this.nMapH = this.objMapRatio.y / this.objMapRatio.x * nMapElementW;

      if(this.nMapH > 300) {
        this.nMapH = 300;
        this.nMapW = this.objMapRatio.x / this.objMapRatio.y * this.nMapH;
      } else {
        this.nMapW = nMapElementW;
      }

      if(this.bIsNextStatus) {
        this.nMapH = nMapElementH;
        this.nMapW = this.objMapRatio.x / this.objMapRatio.y * this.nMapH;
      }

      this.bIsStartCalculate = true;
    } else {
      let nScale = 1;
      if(this.bIsColumnMethod) {
        nScale = 0.9;
      }
      this.nMapH = this.mapContainer.nativeElement.offsetHeight * nScale;
      this.nMapW = this.objMapRatio.x / this.objMapRatio.y * this.nMapH;

      if(nMapElementW < this.nMapW) {
        this.nMapW = nMapElementW * nScale;
        this.nMapH = this.objMapRatio.y / this.objMapRatio.x * this.nMapW;
      }
    }

    this.mapCanvas.width     = this.nMapW;
    this.mapCanvas.height    = this.nMapH;
    this.effectCanvas.width  = this.nMapW;
    this.effectCanvas.height = this.nMapH;
    this.nCanvasToimageRateW  = this.nMapW / this.objMapRatio.x;
    this.nCanvasToimageRateH  = this.nMapH / this.objMapRatio.y;

    let that = this;
    let img = new Image();
    img.src = this.strApiUrl+ this.strMapImg;

    img.onload = function() {
      ($img as any).width = that.objMapRatio.x;
      ($img as any).height = that.objMapRatio.y;
      that.nCanvasToimageRateW = that.mapCanvas.width / img.width;
      that.nCanvasToimageRateH = that.mapCanvas.height / img.height;

      that.drawAllDamageArea();
    };

    img.onerror = function() {
      console.log('This image url is invalid: ' + img.src);
    };
  }

  /*
  load background car image to canvas
  */
  loadCarImage(nCount: number = 0) {
    this.mapCanvas = document.getElementById(this.strImageCanvasId);
    this.effectCanvas = document.getElementById(this.strEffectCanvasId);

    if(nCount > 30) {
      console.log('Timeout to load the image!');
    } else if(!this.mapCanvas) {
      nCount ++;
      setTimeout(() => this.loadCarImage(nCount), 100);
    } else {
      this.getMapContainerSize();
    }
  }

  /*
  check if point is inside polygon
  params:
  - poly: the coordinate array where the polygon is covered
  - pt: the coordinate which is on current mouse
  return:
  true or false which point is in polygon
  */
  isPointInPoly(poly: CoordiateModel[], pt: CoordiateModel) {

    var inside = false;

    let x = pt.x;
    let y = pt.y;

    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i].x, yi = poly[i].y;
      var xj = poly[j].x, yj = poly[j].y;

      var intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
  }

  /*
  get the position (index) in damage array
  params:
  - mousePoint: the current mouse point coordinate
  return:
  index which is global polygonList array index
  */
  getCurrentPosition(mousePoint: CoordiateModel) {
    let mousePointOnRate = new CoordiateModel();
    mousePointOnRate.x = mousePoint.x / this.nCanvasToimageRateW;
    mousePointOnRate.y = mousePoint.y / this.nCanvasToimageRateH;

    if(this.bPreShowDamages) { // damage popup modal
      for(let i=0; i<this.mapList.length; i++) {
        let item = this.mapList[i];
        if(item['parentData']['Title'] === 'Bound Box') {
          for(let j=0; j<item['child'].length; j++) {

            if(this.isPointInPoly(item['child'][j]['polygons'], mousePointOnRate)) {
              if(this.isPointInPoly(item['parentPolygons'], mousePointOnRate)) {
                return item['child'][j]['index'];
              } else {
                return -1;
              }
            }
          }
        } else {
          if(this.isPointInPoly(item['parentPolygons'], mousePointOnRate)) {
            return item['index'];
          }
        }
      }
    } else {
      if(this.bIsOutlineMethod) {
        let mousePointOnRate = new CoordiateModel();
        mousePointOnRate.x = mousePoint.x / this.nCanvasToimageRateW;
        mousePointOnRate.y = mousePoint.y / this.nCanvasToimageRateH;

        for(let i=0; i<this.mapList.length; i++) {
          if(this.isPointInPoly(this.mapList[i]['polygon'], mousePointOnRate)) {
            return i;
          }
        }
        return -1;
      } else {
        for(let i=0; i<this.mapList.length; i++) {
          if(this.mapList[i]['data'].hasOwnProperty('x') && this.mapList[i]['data'].hasOwnProperty('y')) {
            let pt = this.mapList[i]['data'];
            let xRightDeviation = 20;
            let yRightDeviation = 20;
            let xOppositeDeviation = 0;

            if(this.nCurrentDamageIndex === i) {
              let startX = pt['x'] * this.nCanvasToimageRateW;
              let ctx = this.mapCanvas.getContext('2d');
              var metrics = ctx.measureText(pt['Part']);
              let detailTextWidth = metrics.width;

              if(this.mapCanvas.width/2 < startX) {
                xOppositeDeviation -= detailTextWidth;
                xOppositeDeviation -= 10;
              } else {
                xRightDeviation += detailTextWidth;
                xRightDeviation += 10;
              }
            }

            if((pt['x'] + xOppositeDeviation) <= mousePointOnRate.x &&
              pt['y'] <= mousePointOnRate.y &&
              (pt['x'] + xRightDeviation) >= mousePointOnRate.x &&
              (pt['y'] + yRightDeviation) >= mousePointOnRate.y) {
              return i;
            }

          } else {
            console.log('X and Y of the map list is not existed');
          }
        }
      }
    }

    return -1;
  }

  /*
  draw the polygon into canvas
  params:
  - coordinate: the coordinate array which cover the polygon
  - bgColor: the polygon background
  */
  drawPolygons(canvas: any,
    polygon: CoordiateModel[],
    style: Object) {
    let ctx = canvas.getContext('2d');

    if(!polygon) {
      console.log('Not ready to draw polygon.');
      return;
    }

    for(let i=0; i<polygon.length; i ++) {
      if(i===0) {
        ctx.beginPath();
        ctx.moveTo(polygon[i].x*this.nCanvasToimageRateW, polygon[i].y*this.nCanvasToimageRateH);
      } else {
        ctx.lineTo(polygon[i].x*this.nCanvasToimageRateW, polygon[i].y*this.nCanvasToimageRateH);
      }
    }
    ctx.closePath();
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle= (style as any).borderColor;
    ctx.lineWidth = (style as any).borderWidth;
    ctx.stroke();
    ctx.globalAlpha = (style as any).bgOpacity;
    ctx.fillStyle = (style as any).bgColor;
    // ctx.globalCompositeOperation='destination-over';
    ctx.fill();
  }

  /*
  get polygon data with id in the map list
  */
  getPolygonData(index: number) {
    for(let i=0; i<this.mapList.length; i++) {
      let item = this.mapList[i];
      if(item['parentData'] && item['parentData']['Title'] === 'Bound Box') {
        for(let j=0; j<item['child'].length; j++) {
          if(item['child'][j]['index'] === index) {
            return item['child'][j]['polygons'];
          }
        }
      } else {
        if(item['index'] === index) {
          return item['parentPolygons'];
        }
      }
    }

    return null;
  }

  /*
  delete polygon
  */
  updatePolygon(polygon: any[]) {
    this.selectedPolygonList = polygon;
    this.drawAllDamageArea();
  }

  /*
  get checkmark postion
  */
  getCheckMarkPostion(polygonId: number) {
    let position = new CoordiateModel();
    let sx = 0,
    sy = 0,
    sL = 0;
    let polygons: CoordiateModel[] = this.mapList[polygonId]['polygon'];

    for(let i = 0; i < polygons.length; i ++) {
      let x0: number, y0: number, x1: number, y1: number;
      if(i===0) {
        x0 = polygons[polygons.length-1].x;
        y0 = polygons[polygons.length-1].y;
      } else {
        x0 = polygons[i-1].x;
        y0 = polygons[i-1].y;
      }

      x1 = polygons[i].x;
      y1 = polygons[i].y;
      let L = Math.pow(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2), 0.5);
      sx += (x0 + x1)/2 * L;
      sy += (y0 + y1)/2 * L;
      sL += L;
    }
    position.x = sx / sL;
    position.y = sy / sL;

    return position;
  }

   /*
  draw checkmark
  */
  drawCheckMark(polygonId: number) {
    if(!this.bIsOutlineMethod) {
      return;
    }

    let polygonPostion: CoordiateModel = this.getCheckMarkPostion(polygonId);

    let imgSrc = 'assets/img/checkmark.png';
    let ctxImg = this.mapCanvas.getContext('2d');
    let imgW = 16, imgH = 16;
    let imgStartX = polygonPostion.x * this.nCanvasToimageRateW - imgW/2;
    let imgStartY = polygonPostion.y * this.nCanvasToimageRateW - imgH/2;
    let img = new Image();
    img.src = imgSrc;
    let that = this;
    img.onload = function() {
      ctxImg.globalAlpha = 1;
      ctxImg.drawImage(img, imgStartX, imgStartY, imgW, imgH);
      that.bIsMapImgLaod = true;
    };

    img.onerror = function() {
      console.log('This image url is invalid: ' + img.src);
    };
  }

  /*
  draw all hint plus icons
  */
  drawDamageIcons(isLoadFont: boolean = false) {
    let apiUrl = this.strApiUrl;

    for(let i=0; i<this.mapList.length; i++) {
      // let status = this.checkPolygonSize(this.polygonList[i]);
      let bDetail = false;
      let strDetail = '';
      let bChecked = false;
      let iconUrl = '';
      let iconObj = this.mapList[i]['data'];

      if( i===this.nCurrentDamageIndex ) {
        bDetail = true;
        if( iconObj.hasOwnProperty('Part') ) {
          strDetail = iconObj['Part'];
        }
      }

      if( iconObj.hasOwnProperty('Icon') ) {
        iconUrl = apiUrl + iconObj['Icon'];
      }

      if(iconObj['data'] && iconObj['data']['complete'] === 1) {
        bChecked = true;
      }

      this.drawPlusIcon(iconObj.x, iconObj.y, false, bDetail, strDetail, bChecked, iconUrl);
    }
  }

  /*
  get the damage data with index
  */
  getDamageData(index: number) {

    for(let i=0; i<this.mapList.length; i++) {
      let item = this.mapList[i];
      if(item['parentData'] && item['parentData']['Title'] === 'Bound Box') {
        for(let j=0; j<item['child'].length; j++) {

          if(index === item['child'][j]['index']) {
            let returnData = <any>{};
            returnData['data'] = item['child'][j]['data'];
            if(item['sub']) {
              let arrIntersects: any[] = [];

              for(let c=0; c<item['sub'].length; c++) {
                if( this.checkIntersectionOfPolygons(item['child'][j]['polygons'], item['sub'][c]['polygons']) ) {
                  if(item['sub'][c]['data']['id']) {
                    arrIntersects.push(item['sub'][c]['data']['id']);
                  }
                }
              }
              console.log(arrIntersects);
              if(arrIntersects.length > 0) {
                returnData['intersect'] = arrIntersects;
              }
            }
            return returnData;
          }
        }
      } else {
        if(index === item['index']) {
          return {
            data: item['parentData']
          };
        }
      }
    }

    return null;
  }

  /*nex_severity_event
  click event on canvas
  */
  canvasClick(event: any) {
    event = event || window.event;
    let currentP = new CoordiateModel();

    currentP.x = event.offsetX;
    currentP.y = event.offsetY;
    let currentSelectedInd = this.getCurrentPosition(currentP);
    console.log('currentSelectedInd: '+currentSelectedInd);

    if(currentSelectedInd<0) {
      console.log('There is no image for the Current Position');
    } else {
      if(!this.bPreShowDamages) { // birdeye view
        if(this.bIsColumnMethod) {
          // check if this panel is already completed
          if(this.mapList[currentSelectedInd]['data']['complete'] === 1) {
            this.clickOnImage.emit({value: this.mapList[currentSelectedInd]['data'], id: currentSelectedInd});
            return;
          }

          if(this.nCurrentSPIndex === currentSelectedInd) {
            this.mapList[this.nCurrentSPIndex]['selected'] = this.mapList[this.nCurrentSPIndex]['selected'] ? false : true;
            let ctx = this.mapCanvas.getContext('2d');
            ctx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
            this.drawAllDamageArea();

            if(this.mapList[this.nCurrentSPIndex]['selected']) {
              this.selectAutoPart.emit({
                status: true,
                desc: this.mapList[this.nCurrentSPIndex]['data']['AutoPart'],
                side: this.mapList[this.nCurrentSPIndex]['data']['side']
              });
            } else {
              this.selectAutoPart.emit({status: false});
            }
            return;
          }
        }

        if(this.bIsSelected) {
          this.mapList[this.nCurrentSPIndex]['selected'] = false;
        }

        this.nCurrentSPIndex = currentSelectedInd;

        if(this.bIsOutlineMethod) {
          if(!this.bIsColumnMethod) { // column method
            this.clickOnImage.emit({value: this.mapList[currentSelectedInd]['data'], id: currentSelectedInd});
          } else {
            this.updateSelectionUI();
          }
        } else {
          if(currentSelectedInd === this.nCurrentDamageIndex) {
            this.clickOnImage.emit({value: this.mapList[currentSelectedInd], id: currentSelectedInd});
          } else {
            this.nCurrentDamageIndex = currentSelectedInd;
            this.drawDamageIcons();
          }
        }

        this.bIsSelected = true;
      } else {
        let damageData = this.getDamageData(currentSelectedInd);
        if(damageData) {
          console.log(damageData);
          this.clickOnImage.emit({value: damageData, id: currentSelectedInd});
          this.loadCarImage();
        } else {
          console.log('Can not find the damage data with the index');
        }
      }
    }
  }

  updateSelectionUI() {
    this.mapList[this.nCurrentSPIndex]['selected'] = true;
    let nSection = parseInt(this.mapList[this.nCurrentSPIndex]['data']['section']);
    this.onChangeSlider(nSection);
    this.selectAutoPart.emit({
      status: true,
      desc: this.mapList[this.nCurrentSPIndex]['data']['AutoPart'],
      side: this.mapList[this.nCurrentSPIndex]['data']['side']
    });
  }

  /*
  display checkMark
  */
  displayCheckMark() {
    this.mapList[this.nCurrentSPIndex]['data']['complete'] = 1;
    this.mapList[this.nCurrentSPIndex]['selected'] = true;
    this.bIsSelected = false;
    this.nCurrentDamageIndex = -1;
    this.drawAllDamageArea();
    this.doneAutoPart.emit();
  }

  /*
  update check mark with list
  */
  updateCheckMark() {
    for(let i=0; i<this.mapList.length; i++) {
      if(this.mapList[i]['selected'] || this.mapList[i]['data'] && this.mapList[i]['data']['complete'] === 1) { // draw the selected polygon
        let style = {
          bgColor: 'rgb(255, 232, 125)',
          borderColor: 'transparent',
          bgOpacity: 0.65,
          borderWidth: 0
        };

        this.drawPolygons(this.mapCanvas, this.mapList[i]['polygon'], style);
      }

      if(this.mapList[i]['data'] && this.mapList[i]['data']['complete'] === 1) { // draw check mark
        this.drawCheckMark(i);
      }
    }

    this.getSlideCounts();
  }

  /*
  delete the check mark
  */
  deleteCheckMark(markId: number) {
    this.mapList[markId]['data']['complete'] = 0;
    this.mapList[markId]['selected'] = false;
  }

  checkIntersectionOfPolygons(fstPolygon:CoordiateModel[], sndPolygon:CoordiateModel[]) {
    let result = false;

    result = this.checkPointsInsidePolygon(fstPolygon, sndPolygon);

    if(!result) {
      result = this.checkPointsInsidePolygon(sndPolygon, fstPolygon);
    }

    return result;
  }

  checkPointsInsidePolygon(points:CoordiateModel[], polygon:CoordiateModel[]) {
    for(let i=0; i<points.length; i++) {
      if( this.isPointInPoly(polygon, points[i]) ) {
        return true;
      }
    }

    return false;
  }

  getSlideCounts() {
    let selectedLefts = this.mapList.filter((item: any) => {
      return (item.data.complete === 1) && (item.data.section === 0);
    });

    this.nLeftSlideCounter = selectedLefts.length;

    let selectedCenters = this.mapList.filter((item: any) => {
      return (item.data.complete === 1) && (item.data.section === 1);
    });

    this.nCenterSlideCounter = selectedCenters.length;

    let selectedRights = this.mapList.filter((item: any) => {
      return (item.data.complete === 1) && (item.data.section === 2);
    });

    this.nRightSlideCounter = selectedRights.length;
  }

  sendScreenshot(strSlug: string, strAutoPartId: string) {
    if(strSlug) {
      let postData = {
        code: 200,
        data: {
          slug: strSlug,
          img: this.mapCanvas.toDataURL('image/png'),
          width: this.mapCanvas.width,
          height: this.mapCanvas.height,
          url: this.strImgSrc,
          autoPartId: strAutoPartId
        }
      };

      this._dataService.post('v1/data/snapshotupload', postData)
        .subscribe((res: any) => {
          console.log('Success to upload the screenshot.');
        }, (error: any) => console.error('Unable to fetch brands', error));
    } else {
      console.log('To send a screenshot, there is no slug.');
    }
  }

  onChangeSlider(nSlider: number) {
    this.nSelectedSection = nSlider;
    this.getSliderData();
    this.loadCarImage();
  }

  onSlider(nSlider: number) {
    // check if this panel is already completed
    if(this.mapList[nSlider]['data']['complete'] === 1) {
      this.clickOnImage.emit({value: this.mapList[nSlider]['data'], id: nSlider});
      return;
    }

    if(this.nCurrentSPIndex === nSlider) {
      this.mapList[this.nCurrentSPIndex]['selected']= this.mapList[this.nCurrentSPIndex]['selected'] ? false : true;
      let ctx = this.mapCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
      this.drawAllDamageArea();

      if(this.mapList[this.nCurrentSPIndex]['selected']) {
        this.selectAutoPart.emit({
          status: true,
          desc: this.mapList[this.nCurrentSPIndex]['data']['AutoPart'],
          side: this.mapList[this.nCurrentSPIndex]['data']['side']
        });
      } else {
        this.selectAutoPart.emit({status: false});
      }

      return;
    }

    if(this.bIsSelected) {
      this.mapList[this.nCurrentSPIndex]['selected'] = false;
    }

    this.nCurrentSPIndex = nSlider;
    this.updateSelectionUI();
    this.bIsSelected = true;
  }

  onSelectLocation(strLocation: string) {
    this.eventSwitchLocation.emit(strLocation);
  }
}
