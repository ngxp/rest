import { initial, last, takeRight, times, uniq } from 'lodash-es';
import { getMultipart } from '@bms-common/rest/test';
import { generateBoundary, toMultipartBody } from './multipart';

describe('multipart', () => {
    const multipart = getMultipart();

    describe('toMultipartBody', () => {
        const boundary = generateBoundary();
        const multipartBody = toMultipartBody(multipart, boundary);

        it('uses CRLF for line breaks between body party', () => {
            expect(multipartBody.split(`\r\n--${boundary}\r\n`)).toBeArrayOfSize(3);
        });

        it('contains a part for every element of multipart', () => {
            const bodyParts = multipartBody.split(`--${boundary}\r\n`);
            const preamble = bodyParts[0];
            const userPart = parseBodyPart(bodyParts[1]);
            const addressPart = parseBodyPart(bodyParts[2]);
            const ordersPart = parseBodyPart(bodyParts[3]);

            expect(preamble).toBeEmptyString();

            expect(userPart.contentDisposition).toBe('Content-Disposition: form-data; name=user');
            expect(userPart.contentType).toBe('Content-Type: application/json');
            expect(userPart.body).toBe(JSON.stringify(multipart.user.data));

            expect(addressPart.contentDisposition).toBe('Content-Disposition: form-data; name=address');
            expect(addressPart.contentType).toBe('Content-Type: text/uri-list');
            expect(addressPart.body).toBe(multipart.address.data);

            expect(ordersPart.contentDisposition).toBe('Content-Disposition: form-data; name=orders');
            expect(ordersPart.contentType).toBe('Content-Type: text/uri-list');
            expect(ordersPart.body).toBe(multipart.orders.data);
        });

        it('returns a multipart body that ends with --[boundary]--', () => {
            expect(multipartBody).toEndWith(`\r\n--${boundary}--`);
        });
    });

    describe('generateBoundary', () => {
        it('generates a random 70-character string consisting of letters and numbers', () => {
            const boundary = generateBoundary();

            expect(boundary).toMatch(/^[a-zA-Z0-9]{70}$/);
        });

        it('generates a new value on each call', () => {
            const boundaries = times(1000, generateBoundary);

            expect(uniq(boundaries).length).toBe(boundaries.length);
        });
    });
});

function parseBodyPart(bodyPart: string) {
    const lines = initial(bodyPart.split('\r\n'));
    return {
        contentDisposition: lines[0],
        contentType: lines[1],
        body: takeRight(lines, lines.length - 3).join('\r\n')
    };
}
