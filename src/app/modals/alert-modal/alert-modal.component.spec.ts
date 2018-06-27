import {
	async,
	TestBed
} from '@angular/core/testing';
import { OverlayRenderer, DOMOverlayRenderer, Overlay, DialogRef, ModalModule } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { Router } from '@angular/router';
import { AlertModalComponent } from './alert-modal.component';
import { StoreService }  from '../../services/store.service';

describe('Alert Modal component', () => {
	let fixture: any;
	let alertWindowModalComponent: any;
	let mockDialog = {
		context: {
			alertData: {
				data: {
					popupIntro: {
						description: 'description',
						image: 'http://image.com'
					},
					popupMoreDamage: {
						title: 'title',
						description: 'description',
						image: 'http://image.com',
						done_button: {
							color: 'red',
							background_color: 'blue'
						},
						more_button: {
							button: 'more_button',
							color: 'red',
							background_color: 'red',
							on: 1
						}
					}
				}
			}
		},
		close: function(data: Object) {
			return data;
		}
	};

	beforeEach(async(() => {
		const MODAL_PROVIDERS = [
			Modal,
			Overlay,
			{ provide: DialogRef, useValue: mockDialog },
			{ provide: OverlayRenderer, useClass: DOMOverlayRenderer }
		];

		TestBed.configureTestingModule({
			imports: [
				ModalModule.forRoot()
			],
			providers: [
				MODAL_PROVIDERS,
				StoreService,
				{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
			],
			declarations: [
				AlertModalComponent
			]
		}).compileComponents()
		.then(() => {
			fixture = TestBed.createComponent(AlertModalComponent);
			alertWindowModalComponent = fixture.debugElement.componentInstance;
		});
	}));

	it('#ngOnInit function should work', () => {
		alertWindowModalComponent.context = {
			alertData: {
				data: {
					popupMoreDamage: {
						title: 'title',
						description: 'description',
						image: 'http://image.com',
						done_button: {
							button: 'button',
							color: 'red',
							background_color: 'blue',
							on: 1
						},
						more_button: {
							button: 'button',
							color: 'red',
							background_color: 'blue',
							on: 1
						}
					}
				}
			}
		};
		fixture.detectChanges();
		expect(alertWindowModalComponent.modalType).toBeTruthy();
		expect(alertWindowModalComponent.moreBtnObject.on).toEqual(1);
	});

	it('#next function should work', () => {
		let strSlugId = 'slug';
		alertWindowModalComponent.strSlug = strSlugId;
		alertWindowModalComponent.next();
		expect(alertWindowModalComponent.router.navigate).toHaveBeenCalledWith(['/photo', strSlugId]);
	});
});

