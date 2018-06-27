import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { FormsModule }   from '@angular/forms';
import { ZipComponent } from './zip.component';
import { Router, ActivatedRoute } from '@angular/router';

describe('ZipComponent', () => {
  let component: ZipComponent;
  let fixture: ComponentFixture<ZipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZipComponent ],
      imports: [FormsModule],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ slugId: 'id' })
          }
        },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
