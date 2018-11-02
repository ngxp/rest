import { generateBoundary, toMultipartBody } from './multipart';
import { Multipart } from './multipart.model';
import { Resource, ResourceUri } from './resource.model';

export class RequestBody<T> {
    constructor(
        public body: T,
        public contentType: string
    ) { }
}

export class UriListRequestBody extends RequestBody<string> {
    constructor(uriList: ResourceUri[]) {
        super(
            uriList.join('\n'),
            'text/uri-list'
        );
    }
}

export class JsonRequestBody<T> extends RequestBody<T> {
    constructor(jsonResource: T) {
        super(
            jsonResource,
            'application/json'
        );
    }
}

export class MultiPartRequestBody extends RequestBody<string> {
    // see section 7.2.1 Multipart syntax
    // https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html

    constructor(parts: Multipart) {
        const boundary = generateBoundary();
        super(
            toMultipartBody(parts, boundary),
            `multipart/form-data; boundary=${boundary}`
        );
    }
}
