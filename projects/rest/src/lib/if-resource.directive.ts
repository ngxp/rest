import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef, DoCheck } from '@angular/core';
import { hasLink } from './resource-utils';
import { Resource } from './resource.model';

@Directive({
    selector: '[ifResource]',
    standalone: false
})
export class IfResourceDirective implements OnChanges, DoCheck {

    private hasView = false;
    private resource: Resource;
    private linkRel: string;
    private eagerCheck = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    @Input()
    set ifResourceHasLink(linkRel: string) {
        this.linkRel = linkRel;
    }

    @Input()
    set ifResourceEagerCheck(eagerCheck: boolean) {
        this.eagerCheck = eagerCheck;
    }

    @Input()
    set ifResource(resource: Resource) {
        this.resource = resource;
    }

    ngOnChanges() {
        this.update();
    }

    ngDoCheck() {
        if (this.eagerCheck) {
            this.update();
        }
    }

    private update() {
        const linkExists = hasLink(this.resource, this.linkRel);

        if (linkExists && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        }

        if (!linkExists && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }
}
