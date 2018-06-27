import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { SelectModule } from 'angular2-select';
import { RouterModule, Routes } from '@angular/router';
import { VgCoreModule }  from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgBufferingModule } from 'videogular2/buffering';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgStreamingModule } from 'videogular2/streaming';
import { HttpModule } from '@angular/http';
import { FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';

import { DataService } from './services/data.service';
import { StoreService } from './services/store.service';
import { EventService } from './services/event.service';
import { NavbarService } from './services/navbar.service';
import { SpinnerService } from './utilities/spinner/spinner.service';
import { PlayerModalService } from './modals/player-modal/player-modal.service';
import { DisplayModalService } from './modals/display-modal/display-modal.service';
import { CaptureModalService } from './modals/capture-modal/capture-modal.service';
import { UploadModalService } from './modals/upload-modal/upload-modal.service';
import { ShowImgModalService } from './modals/show-img-modal/show-img-modal.service';
import { DisclaimerModalService } from './modals/disclaimer-modal/disclaimer-modal.service';
import { AlertModalService } from './modals/alert-modal/alert-modal.service';
import { DamageModalService } from './modals/damage-modal/damage-modal.service';
import { ConfirmModalService } from './modals/confirm-modal/confirm-modal.service';
import { QuestionsModalService } from './modals/questions-modal/questions-modal.service';


import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PlayerModalComponent } from './modals/player-modal/player-modal.component';
import { SpinnerComponent } from './utilities/spinner/spinner.component';
import { HomeComponent } from './home/home.component';
import { ToolbarComponent } from './utilities/toolbar/toolbar.component';
import { DisplayModalComponent } from './modals/display-modal/display-modal.component';
import { NavbarComponent } from './utilities/navbar/navbar.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { DotSliderComponent } from './utilities/dot-slider/dot-slider.component';
import { ZipComponent } from './zip/zip.component';
import { NextComponent } from './next/next.component';
import { MoreComponent } from './more/more.component';
import { IdentifyComponent } from './identify/identify.component';
import { CaptureModalComponent } from './modals/capture-modal/capture-modal.component';
import { HelpComponent } from './help/help.component';
import { PhotoComponent } from './photo/photo.component';
import { ImgComponent } from './utilities/img/img.component';
import { UploadModalComponent } from './modals/upload-modal/upload-modal.component';
import { ShowImgModalComponent } from './modals/show-img-modal/show-img-modal.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { EstimateComponent } from './estimate/estimate.component';
import { DisclaimerModalComponent } from './modals/disclaimer-modal/disclaimer-modal.component';
import { VehicleModelComponent } from './vehicle-model/vehicle-model.component';
import { GetVehicleComponent } from './get-vehicle/get-vehicle.component';
import { DamageComponent } from './damage/damage.component';
import { CarMapComponent } from './utilities/car-map/car-map.component';
import { DamageLocationComponent } from './utilities/damage-location/damage-location.component';
import { AlertModalComponent } from './modals/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { DamageModalComponent } from './modals/damage-modal/damage-modal.component';
import { ImageMapComponent } from './utilities/image-map/image-map.component';
import { LevelSliderComponent } from './utilities/level-slider/level-slider.component';
import { QuestionsModalComponent } from './modals/questions-modal/questions-modal.component';
import { EmulatorComponent } from './utilities/emulator/emulator.component';

const appRoutes: Routes = [
  {
		path: 'welcome/:slugId',
		component: WelcomeComponent
	},
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'ps/:slugId',
    component: HomeComponent
  },
  {
    path: 'vehicle/:slugId',
    component: VehicleComponent
  },
  {
    path: 'zip/ps/:slugId',
    component: ZipComponent
  },
  {
    path: 'next/:slugId',
    component: NextComponent
  },
  {
    path: 'more/:slugId',
    component: MoreComponent
  },
  {
    path: 'identify/:slugId',
    component: IdentifyComponent
  },
  {
    path: 'identify_retry/:slugId',
    component: IdentifyComponent
  },
  {
    path: 'identify_odometer/:slugId',
    component: IdentifyComponent
  },
  {
    path: 'confirm_odometer/:slugId',
    component: IdentifyComponent
  },
  {
    path: 'help',
    component: HelpComponent
  },
  {
    path: 'photo/:slugId',
    component: PhotoComponent
  },
  {
    path: 'disclaimer',
    component: DisclaimerComponent
  },
  {
    path: 'disclaimer/:slugId',
    component: DisclaimerComponent
  },
  {
    path: 'estimate/:slugId',
    component: EstimateComponent
  },
  {
    path: 'vehicle_model/ps/:slugId/:zipcode',
    component: VehicleModelComponent
  },
  {
    path: 'get_vehicle/:slugId',
    component: GetVehicleComponent
  },
  {
    path: 'damage/:slugId',
    component: DamageComponent
  },
  {
    path: 'emulator/:slugId',
    component: EmulatorComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PlayerModalComponent,
    SpinnerComponent,
    HomeComponent,
    ToolbarComponent,
    DisplayModalComponent,
    NavbarComponent,
    VehicleComponent,
    DotSliderComponent,
    ZipComponent,
    NextComponent,
    MoreComponent,
    IdentifyComponent,
    CaptureModalComponent,
    FileDropDirective,
    FileSelectDirective,
    HelpComponent,
    PhotoComponent,
    ImgComponent,
    UploadModalComponent,
    ShowImgModalComponent,
    DisclaimerComponent,
    EstimateComponent,
    DisclaimerModalComponent,
    VehicleModelComponent,
    GetVehicleComponent,
    DamageComponent,
    CarMapComponent,
    DamageLocationComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DamageModalComponent,
    ImageMapComponent,
    LevelSliderComponent,
    QuestionsModalComponent,
    EmulatorComponent
  ],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(appRoutes, {useHash: true}),
    BootstrapModalModule,
    SelectModule,
    VgCoreModule,
		VgControlsModule,
		VgBufferingModule,
		VgOverlayPlayModule,
		VgStreamingModule,
		HttpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
  	DataService,
  	SpinnerService,
  	PlayerModalService,
    DisplayModalService,
    CaptureModalService,
    UploadModalService,
    ShowImgModalService,
    DisclaimerModalService,
    AlertModalService,
    DamageModalService,
    ConfirmModalService,
    StoreService,
    EventService,
    NavbarService,
    QuestionsModalService
  ],
  entryComponents: [
  	PlayerModalComponent,
    DisplayModalComponent,
    CaptureModalComponent,
    UploadModalComponent,
    ShowImgModalComponent,
    DisclaimerModalComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DamageModalComponent,
    QuestionsModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
