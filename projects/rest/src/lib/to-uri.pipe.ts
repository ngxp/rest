import { Pipe, PipeTransform } from '@angular/core';
import { isNull } from 'lodash-es';
import { getUrl } from './resource-utils';
import { Resource } from './resource.model';

@Pipe({
    name: 'toUri'
})
export class ToUriPipe implements PipeTransform {

    transform(resource: Resource, linkRel = 'self'): string {
        if (isNull(resource)) {
            return null;
        }

        return getUrl(resource, linkRel);
    }

}
