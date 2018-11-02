import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CREATED } from 'http-status-codes';
import { isNull, isUndefined, reduce } from 'lodash-es';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { RequestBody } from './request-body.model';

export interface Headers {
    [key: string]: any | any[];
}

export interface UrlParams {
    [key: string]: any | any[];
}

@Injectable()
export class HttpService {

    constructor(
        private httpClient: HttpClient
    ) { }

    get(url: string, urlParams?: UrlParams) {
        return this.httpClient.get(
            url,
            this.getOptions(undefined, urlParams)
        );
    }

    post(url: string, requestBody: RequestBody<any> = null, urlParams?: UrlParams) {
        return this.httpClient.post(
            url,
            requestBody.body,
            {
                // TODO: remove this when Angular issues are resolved
                responseType: 'text',
                observe: 'response',
                ...this.getOptions(requestBody, urlParams)
            }
        )
            .switchMap(response => this.handlePostRedirect(response))
            // TODO: remove this when Angular issues are resolved
            // https://github.com/angular/angular/issues/19090
            // https://github.com/angular/angular/issues/19413
            .map(response => this.parseResponseBody(response.body))
            .catch(response => Observable.throw(this.parseResponseBody(response.error)));
    }

    put(url: string, requestBody: RequestBody<any> = null, urlParams?: UrlParams) {
        return this.httpClient.put(
            url,
            requestBody.body,
            {
                responseType: 'text',
                observe: 'response',
                ...this.getOptions(requestBody, urlParams)
            }
        )
            // TODO: remove this when Angular issues are resolved
            // https://github.com/angular/angular/issues/19090
            // https://github.com/angular/angular/issues/19413
            .map(response => this.parseResponseBody(response.body))
            .catch(response => Observable.throw(this.parseResponseBody(response.error)));
    }

    patch(url: string, requestBody: RequestBody<any> = null, urlParams?: UrlParams) {
        return this.httpClient.patch(
            url,
            requestBody.body,
            {
                responseType: 'text',
                observe: 'response',
                ...this.getOptions(requestBody, urlParams)
            }
        )
            // TODO: remove this when Angular issues are resolved
            // https://github.com/angular/angular/issues/19090
            // https://github.com/angular/angular/issues/19413
            .map(response => this.parseResponseBody(response.body))
            .catch(response => Observable.throw(this.parseResponseBody(response.error)));
    }

    delete(url, urlParams?: UrlParams) {
        return this.httpClient.delete(
            url,
            this.getOptions(undefined, urlParams)
        );
    }

    private getOptions(requestBody: RequestBody<any>, urlParams?: UrlParams) {
        return {
            headers: this.parseHeaders(this.getHeaders(requestBody)),
            params: this.parseUrlParams(urlParams)
        };
    }

    private handlePostRedirect<T>(response: HttpResponse<any>): Observable<HttpResponse<string>> {
        const location = response.headers.get('Location');
        if (response.status !== CREATED || isNull(location)) {
            return Observable.of(response);
        }

        return this.httpClient.get(
            location,
            {
                // TODO: remove this when Angular issues are resolved
                // https://github.com/angular/angular/issues/19090
                // https://github.com/angular/angular/issues/19413
                responseType: 'text',
                observe: 'response',
                ...this.getOptions(undefined)
            }
        );
    }

    private parseResponseBody(responseBody: string): Object {
        try {
            return JSON.parse(responseBody);
        } catch (error) {
            return null;
        }
    }

    private parseHeaders(headers: Headers): HttpHeaders {
        const params = reduce(
            headers,
            (httpHeaders, value, key) => httpHeaders.append(key, value),
            new HttpHeaders()
        );
        return params;
    }

    private parseUrlParams(urlParams: UrlParams): HttpParams {
        const params = reduce(
            urlParams,
            (httpParams, value, key) => httpParams.append(key, value),
            new HttpParams()
        );
        return params;
    }

    private getHeaders(body: RequestBody<any>): Headers {
        const headers = {
            Accept: 'application/hal+json'
        };

        if (!isUndefined(body)) {
            headers['Content-Type'] = body.contentType;
        }

        return headers;
    }
}
