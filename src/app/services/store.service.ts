import { Injectable } from '@angular/core';


@Injectable()
export class StoreService {
  tempData: any;

  get(name: string) {
    return localStorage.getItem(name);
  }

  getObject(name: string) {
    var retrievedObject = localStorage.getItem(name);
    return JSON.parse(retrievedObject);
  }

  getTempData() {
    return this.tempData;
  }

  set(name: string, value: string) {
    localStorage.setItem(name, value);
  }

  setObject(name: string, value: Object) {
    localStorage.setItem(name, JSON.stringify(value));
  }

  setTempData(value: any) {
    this.tempData = value;
  }

  removeItem(name: string) {
    localStorage.removeItem(name);
  }
}
