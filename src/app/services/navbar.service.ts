import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavbarService {
	subject = new Subject<any[]>();

	setData(data: any[]) {
		this.subject.next(data);
	}

	getEvent(): Observable<any[]> {
        return this.subject.asObservable();
    }
}
