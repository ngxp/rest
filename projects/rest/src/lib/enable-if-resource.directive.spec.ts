import { getAddressResource, getUserResource } from '@bms-common/rest/test';
import { EnableIfResourceDirective } from './enable-if-resource.directive';
import { Resource } from './resource.model';

describe('EnableIfResourceDirective', () => {
    const enableIfResourceDirective = new EnableIfResourceDirective();

    function setupDirective(resource: Resource, linkRel: string) {
        enableIfResourceDirective.enableIfResource = resource;
        enableIfResourceDirective.hasLink = linkRel;
        enableIfResourceDirective.ngOnChanges();
    }

    it('renders the host element when the given resource has the specified link', () => {
        enableIfResourceDirective.enableIfResource = getUserResource();
        enableIfResourceDirective.hasLink = 'place-order';

        enableIfResourceDirective.ngOnChanges();

        expect(enableIfResourceDirective.disabled).toBeFalse();
    });

    it('does not render the host element when no resource is given', () => {
        enableIfResourceDirective.enableIfResource = null;
        enableIfResourceDirective.hasLink = 'place-order';

        enableIfResourceDirective.ngOnChanges();

        expect(enableIfResourceDirective.disabled).toBeTrue();
    });

    it('does not render the host element when the given resource does not have the specified link', () => {
        enableIfResourceDirective.enableIfResource = getUserResource();
        enableIfResourceDirective.hasLink = 'invalid';

        enableIfResourceDirective.ngOnChanges();

        expect(enableIfResourceDirective.disabled).toBeTrue();
    });

    it('removes the host element when the resource changes and it does not have the specified link', () => {
        setupDirective(getUserResource(), 'place-order');
        enableIfResourceDirective.enableIfResource = getAddressResource();

        enableIfResourceDirective.ngOnChanges();

        expect(enableIfResourceDirective.disabled).toBeTrue();
    });

    it('removes the host element when the link relation changes and the resource does not have the specified link', () => {
        setupDirective(getUserResource(), 'place-order');
        enableIfResourceDirective.hasLink = 'invalid';

        enableIfResourceDirective.ngOnChanges();

        expect(enableIfResourceDirective.disabled).toBeTrue();
    });

    it('renders the host element when the resource changes and it now does have the specified link', () => {
        setupDirective(getAddressResource(), 'place-order');
        enableIfResourceDirective.enableIfResource = getUserResource();

        enableIfResourceDirective.ngOnChanges();

        expect(enableIfResourceDirective.disabled).toBeFalse();
    });

    it('renders the host element when the link relation changes and the resource now does have the specified link', () => {
        setupDirective(getUserResource(), 'invalid');
        enableIfResourceDirective.hasLink = 'place-order';

        enableIfResourceDirective.ngOnChanges();

        expect(enableIfResourceDirective.disabled).toBeFalse();
    });

    it('does not check the resource for the given link relation when eager checks are disabled and ngDoCheck is called', () => {
        enableIfResourceDirective.enableIfResource = getUserResource();
        enableIfResourceDirective.hasLink = 'invalid';
        enableIfResourceDirective.ngOnChanges();
        enableIfResourceDirective.eagerCheck = false;
        enableIfResourceDirective.hasLink = 'place-order';

        enableIfResourceDirective.ngDoCheck();

        expect(enableIfResourceDirective.disabled).toBeTrue();
    });

    it('checks the resource for the given link relation when eager checks are enabled and ngDoCheck is called', () => {
        enableIfResourceDirective.enableIfResource = getUserResource();
        enableIfResourceDirective.hasLink = 'invalid';
        enableIfResourceDirective.ngOnChanges();
        enableIfResourceDirective.eagerCheck = true;
        enableIfResourceDirective.hasLink = 'place-order';

        enableIfResourceDirective.ngDoCheck();

        expect(enableIfResourceDirective.disabled).toBeFalse();
    });

});
