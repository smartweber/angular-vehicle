import {
    Component,
    Input,
    OnInit,
    OnChanges,
    ElementRef } from '@angular/core';

@Component({
    selector: 'dot-slider',
    templateUrl: './dot-slider.component.html',
	styleUrls: ['./dot-slider.component.css']
})

export class DotSliderComponent implements OnInit, OnChanges {
    @Input() sliderCount: number;
    @Input() currentSliderCounter: number;

    arrNumSliderCounters: number[];
    arrStrSliderBgColors: string[];
    el: ElementRef;

    constructor(el: ElementRef) {
        this.arrNumSliderCounters = [];
        this.arrStrSliderBgColors = [];
        this.el = el;
    }

    ngOnInit() {
        if(this.sliderCount && this.currentSliderCounter) {
            this.initSlider(this.sliderCount, this.currentSliderCounter);
        }
    }

    ngOnChanges() {
        if(this.sliderCount && this.currentSliderCounter) {
            this.initSlider(this.sliderCount, this.currentSliderCounter);
        }
    }

    initSlider(totalCount: number, currentCouter: number) {
        let sliderW = this.el.nativeElement.querySelector('.dot-wrapper').offsetWidth;
        let stepW = sliderW / (totalCount-1);

        let eleLeft = -6;
        for(let i=0; i<totalCount; i++) {
            this.arrNumSliderCounters[i] = eleLeft + stepW * i;
            if(currentCouter > i) {
                this.arrStrSliderBgColors[i] = '#3497fd';
            } else {
                this.arrStrSliderBgColors[i] = '';
            }
        }
    }
}
