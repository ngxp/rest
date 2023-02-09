import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isNull, isUndefined } from 'lodash-es';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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

    get<T>(url: string, urlParams?: UrlParams): Observable<T> {
        return this.httpClient.get<T>(
            url,
            this.getOptions(undefined, urlParams)
        );
    }

    post<T, U>(url: string, requestBody: RequestBody<T> = null, urlParams?: UrlParams): Observable<U> {
        return this.httpClient.post<U>(
            url,
            requestBody.body,
            {
                observe: 'response',
                ...this.getOptions(requestBody, urlParams)
            }
        )
            .pipe(
                switchMap(response => this.handlePostRedirect(response)),
                catchError(response => throwError(() => response.error))
            );
    }

    put<T, U>(url: string, requestBody: RequestBody<T> = null, urlParams?: UrlParams): Observable<U> {
        return this.httpClient.put<U>(
            url,
            requestBody.body,
            {
                ...this.getOptions(requestBody, urlParams)
            }
        )
            .pipe(
                catchError(response => throwError(() => response.error))
            );
    }

    patch<T, U>(url: string, requestBody: RequestBody<T> = null, urlParams?: UrlParams): Observable<U> {
        return this.httpClient.patch<U>(
            url,
            requestBody.body,
            {
                ...this.getOptions(requestBody, urlParams)
            }
        )
            .pipe(
                catchError(response => throwError(() => response.error))
            );
    }

    delete<T>(url, urlParams?: UrlParams): Observable<T> {
        return this.httpClient.delete<T>(
            url,
            this.getOptions(undefined, urlParams)
        );
    }

    private getOptions(requestBody: RequestBody<any>, urlParams?: UrlParams): { headers: HttpHeaders; params: HttpParams } {
        return {
            headers: this.parseHeaders(this.getHeaders(requestBody)),
            params: this.parseUrlParams(urlParams)
        };
    }

    private handlePostRedirect<T>(response: HttpResponse<T>): Observable<T> {
        const location = response.headers.get('Location');
        if (response.status !== 201 || isNull(location)) {
            return of(response.body);
        }

        return this.httpClient.get<T>(
            location,
            {
                ...this.getOptions(undefined)
            }
        );
    }

    private parseHeaders(headers: Headers): HttpHeaders {
        return new HttpHeaders(headers);
    }

    private parseUrlParams(urlParams: UrlParams): HttpParams {
        return new HttpParams({ fromObject: urlParams });
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
