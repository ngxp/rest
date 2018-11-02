import { TemplateRef, ViewContainerRef } from '@angular/core';
import { getAddressResource, getUserResource } from '@bms-common/rest/test';
import { IfResourceDirective } from './if-resource.directive';
import { Resource } from './resource.model';

describe('IfResourceDirective', () => {
    const templateRef = {};
    const viewContainer = {
        clear: jasmine.createSpy('viewContainer.clear'),
        createEmbeddedView: jasmine.createSpy('viewContainer.createEmbeddedView')
    };
    let ifResourceDirective: IfResourceDirective;

    function clearSpyCalls() {
        viewContainer.clear.calls.reset();
        viewContainer.createEmbeddedView.calls.reset();
    }

    function setupDirective(resource: Resource, linkRel: string) {
        ifResourceDirective.ifResource = resource;
        ifResourceDirective.ifResourceHasLink = linkRel;
        ifResourceDirective.ngOnChanges();
        clearSpyCalls();
    }

    beforeEach(() => {
        clearSpyCalls();

        ifResourceDirective = new IfResourceDirective(
            (<any> templateRef),
            (<any> viewContainer)
        );
    });

    it('renders the host element when the given resource has the specified link', () => {
        ifResourceDirective.ifResource = getUserResource();
        ifResourceDirective.ifResourceHasLink = 'place-order';

        ifResourceDirective.ngOnChanges();

        expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
        expect(viewContainer.clear).not.toHaveBeenCalled();
    });

    it('does not render the host element when no resource is given', () => {
        ifResourceDirective.ifResource = null;
        ifResourceDirective.ifResourceHasLink = 'place-order';

        ifResourceDirective.ngOnChanges();

        expect(viewContainer.createEmbeddedView).not.toHaveBeenCalled();
        expect(viewContainer.clear).not.toHaveBeenCalled();
    });

    it('does not render the host element when the given resource does not have the specified link', () => {
        ifResourceDirective.ifResource = getUserResource();
        ifResourceDirective.ifResourceHasLink = 'invalid';

        ifResourceDirective.ngOnChanges();

        expect(viewContainer.createEmbeddedView).not.toHaveBeenCalled();
        expect(viewContainer.clear).not.toHaveBeenCalled();
    });

    it('removes the host element when the resource changes and it does not have the specified link', () => {
        setupDirective(getUserResource(), 'place-order');
        ifResourceDirective.ifResource = getAddressResource();

        ifResourceDirective.ngOnChanges();

        expect(viewContainer.createEmbeddedView).not.toHaveBeenCalled();
        expect(viewContainer.clear).toHaveBeenCalled();
    });

    it('removes the host element when the link relation changes and the resource does not have the specified link', () => {
        setupDirective(getUserResource(), 'place-order');
        ifResourceDirective.ifResourceHasLink = 'invalid';

        ifResourceDirective.ngOnChanges();

        expect(viewContainer.createEmbeddedView).not.toHaveBeenCalled();
        expect(viewContainer.clear).toHaveBeenCalled();
    });

    it('renders the host element when the resource changes and it now does have the specified link', () => {
        setupDirective(getAddressResource(), 'place-order');
        ifResourceDirective.ifResource = getUserResource();

        ifResourceDirective.ngOnChanges();

        expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
        expect(viewContainer.clear).not.toHaveBeenCalled();
    });

    it('renders the host element when the link relation changes and the resource now does have the specified link', () => {
        setupDirective(getUserResource(), 'invalid');
        ifResourceDirective.ifResourceHasLink = 'place-order';

        ifResourceDirective.ngOnChanges();

        expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
        expect(viewContainer.clear).not.toHaveBeenCalled();
    });

    it('does not check the resource for the given link relation when eager checks are disabled and ngDoCheck is called', () => {
        ifResourceDirective.ifResource = getUserResource();
        ifResourceDirective.ifResourceHasLink = 'invalid';
        ifResourceDirective.ngOnChanges();
        ifResourceDirective.ifResourceEagerCheck = false;
        ifResourceDirective.ifResourceHasLink = 'place-order';

        ifResourceDirective.ngDoCheck();

        expect(viewContainer.createEmbeddedView).not.toHaveBeenCalled();
        expect(viewContainer.clear).not.toHaveBeenCalled();
    });

    it('checks the resource for the given link relation when eager checks are enabled and ngDoCheck is called', () => {
        ifResourceDirective.ifResource = getUserResource();
        ifResourceDirective.ifResourceHasLink = 'invalid';
        ifResourceDirective.ngOnChanges();
        ifResourceDirective.ifResourceEagerCheck = true;
        ifResourceDirective.ifResourceHasLink = 'place-order';

        ifResourceDirective.ngDoCheck();

        expect(viewContainer.createEmbeddedView).toHaveBeenCalled();
        expect(viewContainer.clear).not.toHaveBeenCalled();
    });

});
