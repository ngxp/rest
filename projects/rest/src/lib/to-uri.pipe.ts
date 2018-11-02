import { Pipe, PipeTransform } from '@angular/core';
import { isNull } from 'lodash-es';
import { getUrl } from './resource-utils';
import { LinkRel } from './resource.linkrel';
import { Resource } from './resource.model';

@Pipe({
    name: 'toUri'
})
export class ToUriPipe implements PipeTransform {

    transform(resource: Resource, linkRel: string = LinkRel.Self): string {
        if (isNull(resource)) {
            return null;
        }

        return getUrl(resource, linkRel);
    }

}
