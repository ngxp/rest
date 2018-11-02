import { JsonRequestBody, RequestBody } from './request-body.model';

export function toRequestBody<T>(body: T): RequestBody<T> {
    if (body instanceof RequestBody) {
        return body;
    }

    return new JsonRequestBody(body);
}
