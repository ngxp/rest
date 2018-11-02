import { cloneDeep } from 'lodash-es';
import { getListResourceItems, ResourceMap } from '../index';
import { getUser, UserResource, getUserListResource, getUserResource, getUserResources } from '@bms-common/rest/test';
import { getEmbeddedResource, getLink, getResourceListDiff, getResourceState, getUrl, hasEmbeddedResource, hasLink, isResource, toUriList, toResourceMap } from './resource-utils';
import { LinkRel } from './resource.linkrel';

describe('resourceUtils', () => {
    const user = getUser();
    const userResource = getUserResource();
    const userResources = getUserResources();
    const userListResource = getUserListResource();

    describe('hasLink', () => {
        it('returns true if the resource has the given link', () => {
            expect(hasLink(userResource, 'orders')).toBeTrue();
        });

        it('returns false if the resource does not have the given link', () => {
            expect(hasLink(userResource, 'invalid')).toBeFalse();
        });
    });

    describe('getLink', () => {
        it(`returns the resource's self link if no link relation is given`, () => {
            expect(getLink(userResource)).toBe(userResource._links[LinkRel.Self]);
        });

        it(`returns the link identified by the given link relation`, () => {
            expect(getLink(userResource, 'orders')).toBe(userResource._links.orders);
        });

        it(`throws an error if the resource does not have any links (and therefore is no valid resource)`, () => {
            expect(() => {
                getLink((<any> user), 'orders');
            }).toThrowError();
        });

        it(`throws an error if the resource does not have a link with the given link relation`, () => {
            expect(() => {
                getLink(userResource, 'invalid');
            }).toThrowError();
        });
    });

    describe('getUrl', () => {
        it(`returns the resource's self link URL if no link relation is given`, () => {
            expect(getUrl(userResource)).toBe(userResource._links[LinkRel.Self].href);
        });

        it(`returns the URL identified by the given link relation`, () => {
            expect(getUrl(userResource, 'orders')).toBe(userResource._links.orders.href);
        });

        it(`throws an error if the resource does not have any links (and therefore is no valid resource)`, () => {
            expect(() => {
                getUrl((<any> user), 'orders');
            }).toThrowError();
        });

        it(`throws an error if the resource does not have a link with the given link relation`, () => {
            expect(() => {
                getUrl(userResource, 'invalid');
            }).toThrowError();
        });
    });

    describe('getResourceState', () => {
        it(`returns the resource's state without links and embedded resources`, () => {
            expect(getResourceState(userResource)).toEqual(user);
        });
    });

    describe('isResource', () => {
        it(`returns true if the resource has a _links property and a self link`, () => {
            expect(isResource(userResource)).toBeTrue();
        });

        it(`returns false if the resource has no _links property`, () => {
            expect(isResource(user)).toBeFalse();
        });

        it(`returns false if the resource has no self link`, () => {
            const userWithLinks = {
                ...cloneDeep(user),
                _links: {}
            };
            expect(isResource(userWithLinks)).toBeFalse();
        });
    });

    describe('hasEmbeddedResource', () => {
        it('returns true if the resource has the given link', () => {
            expect(hasEmbeddedResource(userResource, 'address')).toBeTrue();
        });

        it('returns false if the resource does not have an embedded resource identified by the given link relation', () => {
            expect(hasEmbeddedResource(userResource, 'invalid')).toBeFalse();
        });

        it('returns false if the resource does not have any embedded resources', () => {
            expect(hasEmbeddedResource((<any> user), 'address')).toBeFalse();
        });
    });

    describe('getEmbeddedResource', () => {
        it('returns the embedded resource identified by the given link relation', () => {
            expect(getEmbeddedResource(userResource, 'address')).toBe(getEmbeddedResource(userResource, 'address'));
        });

        it('throws an error if the resource does not have any embedded resources', () => {
            expect(() => {
                getEmbeddedResource(userResource, 'invalid');
            }).toThrowError();
        });

        it('throws an error if the resource does not have an embedded resource identified by the given link relation', () => {
            expect(() => {
                getEmbeddedResource((<any> user), 'address');
            }).toThrowError();
        });

        it('does not throw if flag is set and the resource does not have any embedded resources', () => {
            expect(() => {
                getEmbeddedResource(userResource, 'invalid', false);
            }).not.toThrowError();
        })

        it('does not throw if flag is set and the resource does not have an embedded resource identified by the given link relation', () => {
            expect(() => {
                getEmbeddedResource((<any>user), 'address', false);
            }).not.toThrowError();
        })
    });

    describe('getListResourceItems', () => {
        it('returns the items of the list resource', () => {
            expect(getListResourceItems(userListResource, 'userList')).toEqual(userResources);
        });

        it('returns an empty array if the resource does not contain the given list', () => {
            expect(getListResourceItems(userListResource, 'invalid')).toBeEmptyArray();
        });

        it('always returns the same empty array if the resource does not contain the given list', () => {
            expect(getListResourceItems(userListResource, 'invalid')).toBe(getListResourceItems(userListResource, 'invalid'));
        });
    });

    describe('toUriList', () => {
        it('returns a list of URIs for the given list of resources', () => {
            const uris = userResources.map(resource => resource._links.self.href);

            expect(toUriList(userResources)).toEqual(uris);
        });
    });

    describe('getResourceListDiff', () => {
        it('returns an object containing the added, removed and remaining resource IDs', () => {
            const addedResource = userResources[0];
            const removedResource = userResources[1];
            const remainingResource = userResources[2];

            const previousList = [
                removedResource,
                remainingResource
            ];

            const updatedList = [
                remainingResource,
                addedResource
            ];

            expect(getResourceListDiff(previousList, updatedList)).toEqual({
                added: [getUrl(addedResource)],
                removed: [getUrl(removedResource)],
                remaining: [getUrl(remainingResource)]
            });
        });
    });

    describe('toResourceMap', () => {
        it('returns an map of resources with the specified link relation as key', () => {       
            const expectedResource1 = userResources[0];
            const expectedResource2 = userResources[1];
            const expectedResource3 = userResources[2];
            const fromResourceArray: UserResource[] = userResources;

            const actual: ResourceMap<UserResource> = toResourceMap<UserResource>(fromResourceArray,'address');

            expect(actual).not.toBeNull();
            expect(actual[getUrl(expectedResource1, 'address')]).toBe(expectedResource1);
            expect(actual[getUrl(expectedResource2, 'address')]).toBe(expectedResource2);
            expect(actual[getUrl(expectedResource3, 'address')]).toBe(expectedResource3);
        });

        it('returns an map of resouces filtered by the resources without the specified key link relation', () => {
            const expectedResource1 = userResources[0];
            const expectedResource2 = userResources[1];
            const expectedResource3 = userResources[2];
            expectedResource1._links['users'] = { href: '/resources/1/users' };
            expectedResource3._links['users'] = { href: '/resources/3/users' };
            const fromResourceArray = [expectedResource1, expectedResource2, expectedResource3];

            const actual: ResourceMap<UserResource> = toResourceMap<UserResource>(fromResourceArray,'users');

            expect(actual).not.toBeNull();
            expect(actual['/resources/1/users']).toBe(expectedResource1);
            expect(actual['/resources/2/users']).not.toBe(expectedResource2);
            expect(actual['/resources/3/users']).toBe(expectedResource3);
        });
    });

});
