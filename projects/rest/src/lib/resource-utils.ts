import { difference, has, intersection, isUndefined, omit } from 'lodash-es';
import { LinkRel } from './resource.linkrel';
import { Link, Resource, ResourceMap, ResourceUri } from './resource.model';

const emptyArray = [];

export function hasLink(resource: Resource, linkRel: String): boolean {
    return has(resource, `_links.${linkRel}`);
}

export function getLink(resource: Resource, linkRel?: string): Link {
    if (isUndefined(linkRel)) {
        return getLink(resource, LinkRel.Self);
    }

    if (isUndefined(resource._links)) {
        throw new Error(`The given resource has no links: ${JSON.stringify(resource)}`);
    }

    const link = resource._links[linkRel];

    if (isUndefined(link)) {
        throw new Error(`The given resource <${getUrl(resource)}> has no link named <${linkRel}>`);
    }

    return link;
}

export function getUrl(resource: Resource, linkRel?: string): ResourceUri {
    const link = getLink(resource, linkRel);

    return link.href;
}

export function getResourceState(resource: Resource): any {
    return omit(resource, '_links', '_embedded');
}

export function isResource(obj: any) {
    return hasLink(obj, LinkRel.Self);
}

export function hasEmbeddedResource(resource: Resource, linkRel: string): boolean {
    return has(resource, `_embedded.${linkRel}`);
}

export function getEmbeddedResource<T>(resource: Resource, linkRel: string, throwIfNotExists = true): T {
    if (isUndefined(resource._embedded)) {
        if (throwIfNotExists) {
            throw new Error(`The given resource has no embedded resources: ${JSON.stringify(resource)}`);
        }
        return null;
    }

    const embeddedResource = <any>resource._embedded[linkRel];

    if (isUndefined(embeddedResource)) {
        if (throwIfNotExists) {
            throw new Error(`The given resource <${getUrl(resource)}> has no embedded resource named <${linkRel}>`);
        }
        return null;
    }

    return <T>embeddedResource;
}

export function getListResourceItems<T>(resource: Resource, listLinkRel: string, emptyList = emptyArray): T[] {
    if (!hasEmbeddedResource(resource, listLinkRel)) {
        return emptyList;
    }

    return getEmbeddedResource<T[]>(resource, listLinkRel);
}

export function toUriList(resources: Resource[]): ResourceUri[] {
    return resources.map(fileResource => getUrl(fileResource));
}

export function getResourceListDiff(previousResourceList: Resource[], updatedResourceList: Resource[]) {
    const previousResourcesById = previousResourceList.reduce(
        (indexMap, resource) => {
            indexMap[getUrl(resource)] = resource;
            return indexMap;
        },
        {}
    );

    const currentResourcesById = updatedResourceList.reduce(
        (indexMap, resource) => {
            indexMap[getUrl(resource)] = resource;
            return indexMap;
        },
        {}
    );

    const previousIds = Object.keys(previousResourcesById);
    const currentIds = Object.keys(currentResourcesById);

    return {
        added: difference(currentIds, previousIds),
        removed: difference(previousIds, currentIds),
        remaining: intersection(previousIds, currentIds)
    };
}

export function toResourceMap<T extends Resource>(resources: Resource[], keyLinkRel: string): ResourceMap<T> {
    return resources.filter(resource => hasLink(resource, keyLinkRel))
        .reduce((resourceMap: ResourceMap<T>, resource: T) => {
            resourceMap[getUrl(resource, keyLinkRel)] = resource;
            return resourceMap;
        }, {});
}
