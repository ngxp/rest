import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { HttpService } from './http.service';
import { toRequestBody } from './request-body-factory';
import { UriListRequestBody } from './request-body.model';

describe('HttpService', () => {
    let httpService: HttpService;
    let httpController: HttpTestingController;
    const urlParams = { force: true };
    const body = { id: 1 };
    const requestBody = toRequestBody(body);
    const defaultContentType = 'application/json';
    const defaultAccept = 'application/hal+json';
    const customBody = [
        faker.internet.url(),
        faker.internet.url()
    ]
        .join('\n');
    const customRequestBody = new UriListRequestBody(customBody.split('\n'));
    const customContentType = 'text/uri-list';


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                HttpService
            ]
        });

        httpService = TestBed.get(HttpService);
        httpController = TestBed.get(HttpTestingController);
    });

    it('should be initialized', () => {
        expect(httpService).toBeTruthy();
    });

    describe('get', () => {
        it(`gets a resource`, () => {
            httpService.get('/api')
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api');

            expect(request.request.method).toEqual('GET');
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBeNull();

            request.flush({});

            httpController.verify();
        });

        it(`gets a resource with url params`, () => {
            httpService.get('/api', urlParams)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api?force=true');

            expect(request.request.method).toEqual('GET');
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBeNull();

            request.flush({});

            httpController.verify();
        });
    });

    describe('post', () => {
        it(`posts a resource`, () => {
            httpService.post('/api', requestBody)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api');

            expect(request.request.method).toEqual('POST');
            expect(request.request.body).toEqual(body);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(defaultContentType);

            request.flush({});

            httpController.verify();
        });

        it(`posts a resource with url params`, () => {
            httpService.post('/api', requestBody, urlParams)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api?force=true');

            expect(request.request.method).toEqual('POST');
            expect(request.request.body).toEqual(body);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(defaultContentType);

            request.flush({});

            httpController.verify();
        });

        it(`posts a resource with redirect`, () => {
            const redirectUrl = faker.internet.url();
            httpService.post('/api', requestBody)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api');

            expect(request.request.method).toEqual('POST');
            expect(request.request.body).toEqual(body);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(defaultContentType);

            request.flush(null, {
                status: 201,
                statusText: 'Created',
                headers: {
                    Location: redirectUrl
                }
            });

            const followUpRequest = httpController.expectOne(redirectUrl);

            expect(followUpRequest.request.method).toEqual('GET');
            expect(followUpRequest.request.headers.get('Accept')).toBe(defaultAccept);

            followUpRequest.flush({});

            httpController.verify();
        });

        it(`posts a resource`, () => {
            httpService.post('/api', requestBody)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api');

            expect(request.request.method).toEqual('POST');
            expect(request.request.body).toEqual(body);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(defaultContentType);

            request.flush({});

            httpController.verify();
        });

        it(`posts a resource with the content type according to the provided request body`, () => {
            httpService.post('/api', customRequestBody)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api');

            expect(request.request.method).toEqual('POST');
            expect(request.request.body).toEqual(customBody);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(customContentType);

            request.flush({});

            httpController.verify();
        });
    });

    describe('put', () => {
        it(`puts a resource`, () => {
            httpService.put('/api/resource', requestBody)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api/resource');

            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual(body);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(defaultContentType);

            request.flush({});

            httpController.verify();
        });

        it(`puts a resource with url params`, () => {
            httpService.put('/api/resource', requestBody, urlParams)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api/resource?force=true');

            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual(body);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(defaultContentType);

            request.flush({});

            httpController.verify();
        });

        it(`puts a resource with the content type according to the provided request body`, () => {
            httpService.put('/api', customRequestBody)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api');

            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual(customBody);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(customContentType);

            request.flush({});

            httpController.verify();
        });
    });

    describe('patch', () => {
        it(`patches a resource`, () => {
            httpService.patch('/api/resource', requestBody)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api/resource');

            expect(request.request.method).toEqual('PATCH');
            expect(request.request.body).toEqual(body);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(defaultContentType);

            request.flush({});

            httpController.verify();
        });

        it(`patches a resource with url params`, () => {
            httpService.patch('/api/resource', requestBody, urlParams)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api/resource?force=true');

            expect(request.request.method).toEqual('PATCH');
            expect(request.request.body).toEqual(body);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(defaultContentType);

            request.flush({});

            httpController.verify();
        });

        it(`patches a resource with the content type according to the provided request body`, () => {
            httpService.patch('/api', customRequestBody)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api');

            expect(request.request.method).toEqual('PATCH');
            expect(request.request.body).toEqual(customBody);
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBe(customContentType);

            request.flush({});

            httpController.verify();
        });
    });

    describe('delete', () => {
        it(`deletes a resource`, () => {
            httpService.delete('/api/resource')
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api/resource');

            expect(request.request.method).toEqual('DELETE');
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBeNull();

            request.flush({});

            httpController.verify();
        });

        it(`deletes a resource with url params`, () => {
            httpService.delete('/api/resource', urlParams)
                .subscribe(value => {
                    expect(value).toBeObject();
                });

            const request = httpController.expectOne('/api/resource?force=true');

            expect(request.request.method).toEqual('DELETE');
            expect(request.request.headers.get('Accept')).toBe(defaultAccept);
            expect(request.request.headers.get('Content-Type')).toBeNull();

            request.flush({});

            httpController.verify();
        });
    });

});
