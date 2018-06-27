import {
  Component,
  Input,
  Output,
  ElementRef,
  OnChanges,
  ViewChild,
  EventEmitter } from '@angular/core';

/**
 * This class represents the lazy loaded ImageMapComponent.
 */

@Component({
  selector: 'level-slider',
  templateUrl: './level-slider.component.html',
  styleUrls: ['./level-slider.component.css']
})

export class LevelSliderComponent implements OnChanges {
  @Input() max: number;
  @Input() min: number;
  @Input() selectValue: number;
  @ViewChild('damageLevelScreen') damageLevelScreen: ElementRef;

  values: number[];

  colors: string[];
  gradients: string[];

  isLoading: boolean;

  STARTCOLOR = [255, 177, 0];
  ENDCOLOR = [255, 0, 0];

  @Output() onLChange = new EventEmitter();

  constructor(private elRef:ElementRef) {
    this.isLoading = false;
  }

  ngOnChanges() {
    this.makeLevelBar();
  }

  makeLevelBar() {
    let totalWidth = this.damageLevelScreen.nativeElement.offsetWidth;
    let total = this.max - this.min;
    total ++;
    let marginWidth = 2;

    this.values = [];
    this.colors = [];
    this.gradients = [];

    for(let i = 0; i <= total; i ++) {
      let color = this.generateColor(i,total);
      this.colors.push(color);
    }

    for(let i = this.min; i <= this.max; i ++) {
      this.values.push(i);
      let gradient = this.generateBarStyle(i);
      this.gradients.push(gradient);
    }

    this.isLoading = true;
  }

  generateColor(currentValue: number, total: number) {
    let r: number, g: number, b: number, rw: number, gw: number, bw: number;
    rw = (this.STARTCOLOR[0] - this.ENDCOLOR[0]) / total;
    gw = (this.STARTCOLOR[1] - this.ENDCOLOR[1]) / total;
    bw = (this.STARTCOLOR[2] - this.ENDCOLOR[2]) / total;

    r = this.STARTCOLOR[0] - rw * currentValue;
    g = this.STARTCOLOR[1] - gw * currentValue;
    b = this.STARTCOLOR[2] - bw * currentValue;

    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);

    let color = 'rgb(' + r;
    color += ',';
    color += g;
    color += ',';
    color += b;
    color += ')';

    return color;
  }

  generateBarStyle(index: number) {
    index = index - this.min;
    let style = 'linear-gradient(to right,';
    style +=  this.colors[index];
    style +=  ',';
    style +=  this.colors[index+1];
    style +=  ')';
    return style;
  }

  selectChart(value: number) {
    this.onLChange.emit({value: value});
    this.selectValue = value;
  }
}
