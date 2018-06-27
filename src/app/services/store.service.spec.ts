import {
  async,
  TestBed,
  inject
} from '@angular/core/testing';
import { StoreService } from './store.service';

describe('StoreService', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      providers: [
        StoreService
      ]
    }).compileComponents();
  }));

  it('#set function should work', inject([StoreService], (storeService: StoreService) => {
    let testData = 'test';
    storeService.set('test', testData);
    expect(localStorage.getItem('test')).toEqual(testData);
    localStorage.removeItem('test');
  }));

  it('#get function should work', inject([StoreService], (storeService: StoreService) => {
    let testData = 'test';
    storeService.set('test', testData);
    expect(storeService.get('test')).toEqual(testData);
    localStorage.removeItem('test');
  }));

  it('#setObject function should work', inject([StoreService], (storeService: StoreService) => {
    let testData = {
      id: 'id',
      value: 'value'
    };
    storeService.setObject('test', testData);
    expect(localStorage.getItem('test')).toEqual(JSON.stringify(testData));
    localStorage.removeItem('test');
  }));

  it('#getObject function should work', inject([StoreService], (storeService: StoreService) => {
    let testData = {
      id: 'id',
      value: 'value'
    };
    storeService.setObject('test', testData);
    expect(storeService.getObject('test')).toEqual(testData);
    localStorage.removeItem('test');
  }));

  it('#setTempData function should work', inject([StoreService], (storeService: StoreService) => {
    let testData = {
      id: 'id',
      value: 'value'
    };
    storeService.setTempData(testData);
    expect(storeService.tempData).toEqual(testData);
  }));

  it('#getTempData function should work', inject([StoreService], (storeService: StoreService) => {
    let testData = {
      id: 'id',
      value: 'value'
    };
    storeService.setTempData(testData);
    expect(storeService.getTempData()).toEqual(testData);
  }));
});
