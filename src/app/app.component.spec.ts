import { TestBed, async } from '@angular/core/testing';
import {
  Route
} from '@angular/router';
import {
  RouterTestingModule
} from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './utilities/toolbar/toolbar.component';
import { NavbarComponent } from './utilities/navbar/navbar.component';
import { SpinnerComponent } from './utilities/spinner/spinner.component';
import { HomeComponent } from './home/home.component';
import { SpinnerService } from './utilities/spinner/spinner.service';

describe('AppComponent', () => {
  let config: Route[] = [
    {
      path: '',
      component: HomeComponent
    },
    {
      path: 'ps/:slugId',
      component: HomeComponent
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ToolbarComponent,
        NavbarComponent,
        SpinnerComponent,
        HomeComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(config)
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        SpinnerService
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});