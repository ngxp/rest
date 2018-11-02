import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ResourceWrapper } from './resource-wrapper';
import { Resource } from './resource.model';

@Injectable()
export class ResourceFactory {

    constructor(
        private httpService: HttpService
    ) { }

    from(resource: Resource): ResourceWrapper {
        return new ResourceWrapper(
            this.httpService,
            resource
        );
    }

    fromId(id: string): ResourceWrapper {
        return this.from({
            _links: {
                self: { href: id }
            }
        });
    }
}
