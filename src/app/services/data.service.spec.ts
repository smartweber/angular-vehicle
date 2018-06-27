import { inject, TestBed } from '@angular/core/testing';
import { Http,
  BaseRequestOptions,
  ResponseOptions,
  Response,
  RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { DataService } from './data.service';
import { environment } from '../../environments/environment'

describe('DataService', () => {
  let subject: DataService = null;
  let backend: MockBackend = null;
  let host = environment.API + '/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        DataService
      ]
    }).compileComponents();
  });

  beforeEach(inject([DataService, MockBackend], (userService: DataService, mockBackend: MockBackend) => {
    subject = userService;
    backend = mockBackend;
  }));

  it('#get should call endpoint and return it\'s result', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toEqual(RequestMethod.Get);
      expect(connection.request.url).toEqual(host + 'damage');
      expect(connection.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded');
      let options = new ResponseOptions({
        body: JSON.stringify({ success: true })
      });
      connection.mockRespond(new Response(options));
    });

    subject
      .get('damage')
      .subscribe((response: any) => {
        expect(response).toEqual({ success: true });
        done();
      });
  });

  it('#post should call endpoint and return it\'s result', (done) => {
    let data = {
      slug: 'slug'
    };
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.url).toEqual(host + 'damage');
      expect(connection.request.text()).toEqual('data='+JSON.stringify(data));
      expect(connection.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded');
      let options = new ResponseOptions({
        body: JSON.stringify({ success: true })
      });
      connection.mockRespond(new Response(options));
    });

    subject
      .post('damage', data)
      .subscribe((response: any) => {
        expect(response).toEqual({ success: true });
        done();
      });
  });
});
