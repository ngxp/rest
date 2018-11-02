export interface Link {
    href: ResourceUri;
    templated?: boolean;
}

export interface EmbeddedResources {
    [key: string]: Resource | Resource[];
}

export interface Resource {
    _embedded?: EmbeddedResources;

    _links: {
        self: Link;
        [key: string]: Link;
    };
}

export type ResourceUri = string;

export interface ResourceMap<T extends Resource> {
    [key: string]: T;
}

export interface ResourceUpdate<U, R extends Resource = Resource> {
    resource: R;
    update: U;
}
