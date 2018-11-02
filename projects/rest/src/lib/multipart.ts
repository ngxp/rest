import { isString, map, sample, times } from 'lodash-es';
import { BodyPart, Multipart } from './multipart.model';

export function toMultipartBody(parts: Multipart, boundary: string) {
    return [
        ...map(parts, (part, name) => toBodyPart(boundary, name, part)),
        `--${boundary}--`
    ]
        .join('\r\n');
}

function toBodyPart(boundary: string, name: string, part: BodyPart<any>) {
    return [
        `--${boundary}`,
        `Content-Disposition: form-data; name=${name}`,
        `Content-Type: ${part.contentType}`,
        '',
        `${isString(part.data) ? part.data : JSON.stringify(part.data)}`
    ]
        .join('\r\n');
}

export function generateBoundary() {
    return generateBoundaryIdentifier();
}

function generateBoundaryIdentifier() {
    return times(
        70,
        () => sample('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(''))
    )
        .join('');
}
