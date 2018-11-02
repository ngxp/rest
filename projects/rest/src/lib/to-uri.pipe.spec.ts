import { getUserResource } from '@bms-common/rest/test';
import { getUrl } from './resource-utils';
import { ToUriPipe } from './to-uri.pipe';

describe('ToUriPipe', () => {
    const pipe = new ToUriPipe();
    const resource = getUserResource();
    const expectedUri = getUrl(resource);
    const linkRel = 'address';
    const expectedLinkRelUri = getUrl(resource, linkRel);

    it('returns the self link of the given resource', () => {
        expect(pipe.transform(resource)).toBe(expectedUri);
    });

    it('returns the link matching the given link rel from the given resource', () => {
        expect(pipe.transform(resource, linkRel)).toBe(expectedLinkRelUri);
    });

    it('returns null if null is given as resource', () => {
        expect(pipe.transform(null)).toBe(null);
    });

});
