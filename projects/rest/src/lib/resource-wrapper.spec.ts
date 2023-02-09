import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Address, AddressCityUpdate, AddressResource, getAddressResource, getOrder, getOrderListResource, getPartialAddress, getUpdatedAddress, getUpdatedAddressResource, getUserResource, Order, OrderListResource, UserResource } from '../../test';
import { ResourceFactory } from './resource-factory';
import { getEmbeddedResource, getUrl } from './resource-utils';
import { Resource } from './resource.model';
import { RestModule } from './rest.module';

describe('ResourceWrapper', () => {
    let resource: ResourceFactory;
    let httpMock: HttpTestingController;

    const userResource = getUserResource();
    const orderListResource = getOrderListResource();
    const order = getOrder();
    const embeddedAddress = <AddressResource>getEmbeddedResource(userResource, 'address');
    const addressResource = getAddressResource();
    const updatedAddress = getUpdatedAddress();
    const partialAddress = getPartialAddress();
    const updatedAddressResource = getUpdatedAddressResource();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RestModule
            ]
        });

        httpMock = TestBed.inject(HttpTestingController);
        resource = TestBed.inject(ResourceFactory);
    });

    describe('get', () => {
        it(`reloads the given resource if no link relation is given`, () => {
            resource.from(userResource)
                .get<UserResource>()
                .subscribe(response => {
                    expect(response).toEqual(userResource);
                });

            const request = httpMock.expectOne(getUrl(userResource));

            expect(request.request.method).toBe('GET');

            request.flush(userResource);

            httpMock.verify();
        });

        it(`returns an embedded resource identified by the given link relation`, () => {
            resource.from(userResource)
                .get<AddressResource>('address')
                .subscribe(response => {
                    expect(response).toEqual(embeddedAddress);
                });
        });

        it(`returns a linked resource identified by the given link relation`, () => {
            resource.from(userResource)
                .get<OrderListResource>('orders')
                .subscribe(response => {
                    expect(response).toEqual(orderListResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'orders'));

            expect(request.request.method).toBe('GET');

            request.flush(orderListResource);

            httpMock.verify();
        });

        it(`fails if an invalid link relation type is given`, () => {
            expect(() => {
                resource.from(userResource)
                    .get<any>('invalid')
                    .subscribe();
            })
                .toThrowError();
        });

        it(`fails if the given resource has no links`, () => {
            const invalidResource = {};

            expect(() => {
                resource.from(<Resource>invalidResource)
                    .get<any>('invalid')
                    .subscribe();
            })
                .toThrowError();
        });

        it(`adds the given URL params to the request URL`, () => {
            const urlParams = { limit: 10 };

            resource.from(userResource)
                .get<OrderListResource>('orders', urlParams)
                .subscribe(response => {
                    expect(response).toEqual(orderListResource);
                });


            const request = httpMock.expectOne(getUrl(userResource, 'orders') + '?limit=10');

            expect(request.request.method).toBe('GET');

            request.flush(orderListResource);

            httpMock.verify();
        });

        it(`reloads the given resource with the specified URL params if no link relation is given`, () => {
            const urlParams = { force: true };

            resource.from(userResource)
                .get<UserResource>(urlParams)
                .subscribe(response => {
                    expect(response).toEqual(userResource);
                });

            const request = httpMock.expectOne(getUrl(userResource) + '?force=true');

            expect(request.request.method).toBe('GET');

            request.flush(userResource);

            httpMock.verify();
        });
    });

    describe('post', () => {
        it(`submits the request payload via POST to the resource if no link relation is given`, () => {
            resource.from(orderListResource)
                .post<Order, OrderListResource>(order)
                .subscribe(response => {
                    expect(response).toEqual(orderListResource);
                });

            const request = httpMock.expectOne(getUrl(orderListResource));

            expect(request.request.method).toBe('POST');

            request.flush(orderListResource);

            httpMock.verify();
        });

        it(`submits the request payload with the specified URL params via POST to the resource if no link relation is given`, () => {
            const urlParams = { force: true };

            resource.from(orderListResource)
                .post<Order, OrderListResource>(order, urlParams)
                .subscribe(response => {
                    expect(response).toEqual(orderListResource);
                });

            const request = httpMock.expectOne(getUrl(orderListResource) + '?force=true');

            expect(request.request.method).toBe('POST');

            request.flush(orderListResource);

            httpMock.verify();
        });

        it(`submits the request payload via POST to the link relation's URL`, () => {
            resource.from(userResource)
                .post<Order, OrderListResource>('orders', order)
                .subscribe(response => {
                    expect(response).toEqual(orderListResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'orders'));

            expect(request.request.method).toBe('POST');

            request.flush(orderListResource);

            httpMock.verify();
        });

        it(`submits the request payload with the specified URL params via POST to the link relation's URL`, () => {
            const urlParams = { force: true };

            resource.from(userResource)
                .post<Order, OrderListResource>('orders', order, urlParams)
                .subscribe(response => {
                    expect(response).toEqual(orderListResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'orders') + '?force=true');

            expect(request.request.method).toBe('POST');

            request.flush(orderListResource);

            httpMock.verify();
        });

        it(`submits an empty request payload via POST to the link relation's URL`, () => {
            resource.from(userResource)
                .post<Order, OrderListResource>('orders', null)
                .subscribe(response => {
                    expect(response).toEqual(orderListResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'orders'));

            expect(request.request.method).toBe('POST');
            expect(request.request.body).toBeNull();

            request.flush(orderListResource);

            httpMock.verify();
        });

        it(`submits an empty payload with the specified URL params via POST to the link relation's URL`, () => {
            const urlParams = { force: true };

            resource.from(userResource)
                .post<Order, OrderListResource>('orders', null, urlParams)
                .subscribe(response => {
                    expect(response).toEqual(orderListResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'orders') + '?force=true');

            expect(request.request.method).toBe('POST');
            expect(request.request.body).toBeNull();

            request.flush(orderListResource);

            httpMock.verify();
        });

    });

    describe('put', () => {
        it(`submits the request payload via PUT to the resource if no link relation is given`, () => {
            resource.from(addressResource)
                .put<Address, AddressResource>(updatedAddress)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(addressResource));

            expect(request.request.method).toBe('PUT');

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

        it(`submits the request payload with the specified URL params via PUT to the resource if no link relation is given`, () => {
            const urlParams = { force: true };

            resource.from(addressResource)
                .put<Address, AddressResource>(updatedAddress, urlParams)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(addressResource) + '?force=true');

            expect(request.request.method).toBe('PUT');

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

        it(`submits the request payload via PUT to the link relation's URL`, () => {
            resource.from(userResource)
                .put<Address, AddressResource>('address', updatedAddress)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'address'));

            expect(request.request.method).toBe('PUT');

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

        it(`submits the request payload with the specified URL params via PUT to the link relation's URL`, () => {
            const urlParams = { force: true };

            resource.from(userResource)
                .put<Address, AddressResource>('address', updatedAddress, urlParams)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'address') + '?force=true');

            expect(request.request.method).toBe('PUT');

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

        it(`submits an empty request payload via PUT to the link relation's URL`, () => {
            resource.from(userResource)
                .put<Address, AddressResource>('address', null)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'address'));

            expect(request.request.method).toBe('PUT');
            expect(request.request.body).toBeNull();

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

        it(`submits an empty payload with the specified URL params via PUT to the link relation's URL`, () => {
            const urlParams = { force: true };

            resource.from(userResource)
                .put<Address, AddressResource>('address', null, urlParams)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'address') + '?force=true');

            expect(request.request.method).toBe('PUT');
            expect(request.request.body).toBeNull();

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

    });

    describe('patch', () => {
        it(`submits the request payload via PATCH to the resource if no link relation is given`, () => {
            resource.from(addressResource)
                .patch<AddressCityUpdate, AddressResource>(partialAddress)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(addressResource));

            expect(request.request.method).toBe('PATCH');

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

        it(`submits the request payload with the specified URL params via PATCH to the resource if no link relation is given`, () => {
            const urlParams = { force: true };

            resource.from(addressResource)
                .patch<AddressCityUpdate, AddressResource>(partialAddress, urlParams)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(addressResource) + '?force=true');

            expect(request.request.method).toBe('PATCH');

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

        it(`submits the request payload via PATCH to the link relation's URL`, () => {
            resource.from(userResource)
                .patch<AddressCityUpdate, AddressResource>('address', partialAddress)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'address'));

            expect(request.request.method).toBe('PATCH');

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

        it(`submits the request payload with the specified URL params via PATCH to the link relation's URL`, () => {
            const urlParams = { force: true };

            resource.from(userResource)
                .patch<AddressCityUpdate, AddressResource>('address', partialAddress, urlParams)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'address') + '?force=true');

            expect(request.request.method).toBe('PATCH');

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

        it(`submits an empty request payload via PATCH to the link relation's URL`, () => {
            resource.from(userResource)
                .patch<AddressCityUpdate, AddressResource>('address', null)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'address'));

            expect(request.request.method).toBe('PATCH');
            expect(request.request.body).toBeNull();

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

        it(`submits an empty payload with the specified URL params via PATCH to the link relation's URL`, () => {
            const urlParams = { force: true };

            resource.from(userResource)
                .patch<AddressCityUpdate, AddressResource>('address', null, urlParams)
                .subscribe(response => {
                    expect(response).toEqual(updatedAddressResource);
                });

            const request = httpMock.expectOne(getUrl(userResource, 'address') + '?force=true');

            expect(request.request.method).toBe('PATCH');
            expect(request.request.body).toBeNull();

            request.flush(updatedAddressResource);

            httpMock.verify();
        });

    });

    describe('delete', () => {
        it(`submits a DELETE request to the resource if no link relation is given`, () => {
            resource.from(userResource)
                .delete<null>()
                .subscribe(response => {
                    expect(response).toBeNull();
                });

            const request = httpMock.expectOne(getUrl(userResource));

            expect(request.request.method).toBe('DELETE');

            request.flush(null);

            httpMock.verify();
        });

        it(`submits a DELETE request with the specified URL params to the resource if no link relation is given`, () => {
            const urlParams = { force: true };

            resource.from(userResource)
                .delete<null>(urlParams)
                .subscribe(response => {
                    expect(response).toBeNull();
                });

            const request = httpMock.expectOne(getUrl(userResource) + '?force=true');

            expect(request.request.method).toBe('DELETE');

            request.flush(null);

            httpMock.verify();
        });

        it(`submits a DELETE request to the link relation's URL`, () => {
            resource.from(userResource)
                .delete<null>('address')
                .subscribe(response => {
                    expect(response).toBeNull();
                });

            const request = httpMock.expectOne(getUrl(userResource, 'address'));

            expect(request.request.method).toBe('DELETE');

            request.flush(null);

            httpMock.verify();
        });

        it(`submits a DELETE request with the specified URL params to the link relation's URL`, () => {
            const urlParams = { force: true };

            resource.from(userResource)
                .delete<null>('address', urlParams)
                .subscribe(response => {
                    expect(response).toBeNull();
                });

            const request = httpMock.expectOne(getUrl(userResource, 'address') + '?force=true');

            expect(request.request.method).toBe('DELETE');

            request.flush(null);

            httpMock.verify();
        });

    });

});

