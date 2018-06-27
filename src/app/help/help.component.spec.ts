import {
  async,
  TestBed
} from '@angular/core/testing';
import { HelpComponent } from './help.component';

export function main() {
   describe('Help component', () => {
    let originalTimeout: number;

    beforeEach(async(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      TestBed.configureTestingModule({
        declarations: [ HelpComponent ]
      }).compileComponents();
    }));

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('head is diaplayed properly',
      async(() => {
        let fixture = TestBed.createComponent(HelpComponent);
        let compiled = fixture.debugElement.nativeElement;
        let headingName = compiled.querySelector('h3.home-heading');
        expect(headingName.innerHTML).toEqual('Help');
      }));
    });
}
