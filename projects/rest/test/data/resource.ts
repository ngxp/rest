import { cloneDeep } from 'lodash-es';
import { getAddress, getOrders, getUpdatedAddress, getUser, getUsers } from './domain';
import { AddressResource, OrderListResource, OrderResource, User, UserListResource, UserResource } from './domain.model';

const addressResource: AddressResource = {
    ...getAddress(),
    _links: {
        self: { href: '/users/1/address/' }
    }
};

const updatedAddressResource: AddressResource = {
    ...getUpdatedAddress(),
    _links: {
        self: { href: '/users/1/address/' }
    }
};

const userResources: UserResource[] = getUsers()
    .map((user, index) => ({
        ...user,
        _embedded: {
            address: addressResource
        },
        _links: {
            self: { href: `/users/${index}/` },
            address: { href: `/users/${index}/address/` },
            orders: { href: `/users/${index}/orders/` },
            'place-order': { href: `/users/${index}/orders/` }
        }
    }));

const userListResource: UserListResource = {
    _embedded: {
        userList: userResources
    },
    _links: {
        self: { href: '/users/' },
        'new-user': { href: '/users/' }
    }
};

const orderResources: OrderResource[] = getOrders()
    .map((order, index) => ({
        ...order,
        _links: {
            self: { href: `/orders/${index}/` },
            cancel: { href: `/orders/${index}/` }
        }
    }));

const orderListResource: OrderListResource = {
    _embedded: {
        orderList: orderResources
    },
    _links: {
        self: { href: '/orders/' },
        'new-order': { href: '/orders/' }
    }
};

export function getAddressResource(): AddressResource {
    return cloneDeep(addressResource);
}

export function getUpdatedAddressResource(): AddressResource {
    return cloneDeep(updatedAddressResource);
}

export function getUserResource(): UserResource {
    return cloneDeep(userResources[0]);
}

export function getUserResources(): UserResource[] {
    return cloneDeep(userResources);
}

export function getUserListResource(): UserListResource {
    return cloneDeep(userListResource);
}

export function getOrderResource(): OrderResource {
    return cloneDeep(orderResources[0]);
}

export function getOrderListResource(): OrderListResource {
    return cloneDeep(orderListResource);
}
