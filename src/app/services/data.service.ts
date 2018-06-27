import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {
    public host: any;

    constructor(private http: Http) {
      this.host = environment['API'] + '/';
    }

    get(url: string, jsonOption: boolean = true) {
    	let getObservable: any = null;
    	if (getObservable === null) {
            if(jsonOption) {
                getObservable = this.http.get(this.host + url, this._getJsonOptions())
                    .share()
                    .map(res => res.json())
                    .catch(this.handleError);
            } else {
                getObservable = this.http.get(this.host + url, this._getJsonOptions())
                    .share()
                    .catch(this.handleError);
            }
    	}
    	return getObservable;
    }

    post(url: string, data: any): Observable<Object> {
    	let postObservable: any = null;
    	let postData = 'data=' +  JSON.stringify(data);
    	if (postObservable === null) {
	        postObservable = this.http.post(this.host + url, postData, this._getJsonOptions())
	          .share()
	          .map(res => res.json())
	          .catch(this.handleError);
    	}
    	return postObservable;
    }

    // put(url: string, data: any) {
    //   return this.http.put(this.host + url, JSON.stringify(data), this._getJsonOptions());
    // }

    // delete(url: string) {
    //   return this.http.delete(this.host + url, this._getJsonOptions());
    // }

    public handleError(error: Response) {
	    console.error(error);
	    return Observable.throw(error.json().error || 'Server error');
	}

    private _getJsonOptions() {
        let jsonHeaders = new Headers();
        jsonHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        return new RequestOptions({ headers: jsonHeaders });
    }
}
