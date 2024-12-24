import { Directive, DoCheck, HostBinding, Input, OnChanges } from '@angular/core';
import { hasLink } from './resource-utils';
import { Resource } from './resource.model';

@Directive({
    selector: '[enableIfResource]',
    standalone: false
})
export class EnableIfResourceDirective implements OnChanges, DoCheck {

    @HostBinding('disabled')
    disabled = true;

    @Input()
    eagerCheck = false;

    @Input()
    set hasLink(linkRel: string) {
        this.linkRel = linkRel;
    }

    @Input()
    set enableIfResource(resource: Resource) {
        this.resource = resource;
    }

    private resource: Resource;
    private linkRel: string;

    ngOnChanges() {
        this.update();
    }

    ngDoCheck() {
        if (this.eagerCheck) {
            this.update();
        }
    }

    private update() {
        this.disabled = !hasLink(this.resource, this.linkRel);
    }
}
