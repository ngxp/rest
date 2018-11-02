import { Observable, of } from 'rxjs';
import { HttpService, UrlParams } from './http.service';
import { toRequestBody } from './request-body-factory';
import { getEmbeddedResource, getUrl, hasEmbeddedResource } from './resource-utils';
import { Resource } from './resource.model';

export class ResourceWrapper {

    constructor(
        private httpService: HttpService,
        private resourceObj: Resource
    ) { }

    /**
     * Retrieves a single resource from embedded or linked resources
     * @param linkRel Name of the relation in _embedded or _links
     * @param urlParams URL Parameters
     * @returns Observable of the requested Resource
     */
    get<T>(urlParams?: UrlParams): Observable<T>;
    get<T>(linkRel: string, urlParams?: UrlParams): Observable<T>;
    get<T>(...args): Observable<T> {
        const { linkRel, urlParams } = this.extractArgumentsWithoutResourcePayload(args);

        if (hasEmbeddedResource(this.resourceObj, linkRel)) {
            return this.getEmbeddedResource<T>(this.resourceObj, linkRel);
        }

        return this.getLinkedResource<T>(this.resourceObj, linkRel, urlParams);
    }

    post<T, U>(resourcePayload: T, urlParams?: UrlParams): Observable<U>;
    post<T, U>(linkRel: string, body: T, urlParams?: UrlParams): Observable<U>;
    post<T, U>(...args): Observable<U> {
        const { linkRel, body, urlParams } = this.extractArgumentsWithResourcePayload<T>(args);

        return this.httpService
            .post(
                getUrl(this.resourceObj, linkRel),
                toRequestBody(body),
                urlParams
            );
    }

    put<T, U>(resourcePayload: T, urlParams?: UrlParams): Observable<U>;
    put<T, U>(linkRel: string, resourcePayload: T, urlParams?: UrlParams): Observable<U>;
    put<T, U>(...args): Observable<U> {
        const { linkRel, body, urlParams } = this.extractArgumentsWithResourcePayload<T>(args);

        return this.httpService
            .put(
                getUrl(this.resourceObj, linkRel),
                toRequestBody(body),
                urlParams
            );
    }

    patch<T, U>(resourcePayload: T, urlParams?: UrlParams): Observable<U>;
    patch<T, U>(linkRel: string, resourcePayload: T, urlParams?: UrlParams): Observable<U>;
    patch<T, U>(...args): Observable<U> {
        const { linkRel, body, urlParams } = this.extractArgumentsWithResourcePayload<T>(args);

        return this.httpService
            .patch(
                getUrl(this.resourceObj, linkRel),
                toRequestBody(body),
                urlParams
            );
    }

    delete<T>(urlParams?: UrlParams): Observable<T>;
    delete<T>(linkRel: string, urlParams?: UrlParams): Observable<T>;
    delete<T, U>(...args): Observable<U> {
        const { linkRel, urlParams } = this.extractArgumentsWithoutResourcePayload(args);

        return this.httpService
            .delete(
                getUrl(this.resourceObj, linkRel),
                urlParams
            );
    }



    private extractArgumentsWithoutResourcePayload(args: any[]): { linkRel: string; urlParams: {} } {
        let linkRel;
        let urlParams;

        if (typeof args[0] === 'string') {
            linkRel = args[0];
            urlParams = args[1];
        } else {
            linkRel = undefined;
            urlParams = args[0];
        }

        return {
            linkRel,
            urlParams
        };
    }

    private extractArgumentsWithResourcePayload<T>(args: any[]): { linkRel: string; body: T; urlParams: {} } {
        let linkRel;
        let body;
        let urlParams;

        if (typeof args[0] === 'string') {
            linkRel = args[0];
            body = args[1];
            // tslint:disable-next-line:no-magic-numbers
            urlParams = args[2];
        } else {
            linkRel = undefined;
            body = args[0];
            urlParams = args[1];
        }

        return {
            linkRel,
            body,
            urlParams
        };
    }

    private getEmbeddedResource<T>(resource: Resource, linkRel: string): Observable<T> {
        return of<T>(getEmbeddedResource(resource, linkRel));
    }

    private getLinkedResource<T>(resource: Resource, linkRel: string, urlParams?: UrlParams): Observable<T> {
        return this.httpService
            .get(
                getUrl(resource, linkRel),
                urlParams
            );
    }
}
