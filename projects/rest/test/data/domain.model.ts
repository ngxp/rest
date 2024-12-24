import { faker } from "@faker-js/faker";
import { Resource } from "../../src/lib/resource.model";

export interface UserList {
    users: User[];
    totalUsers: number;
}

export interface UserListResource extends Resource {
    _embedded: {
        userList: UserResource[];
        [key: string]: Resource | Resource[];
    };
}

export interface User {
    firstName: string;
    lastName: string;
}

export interface UserUpdate {
    firstName: string;
    lastName: string;
}

export interface UserResource extends User, Resource {}

export interface AddressUpdate extends Address {}

export interface AddressCityUpdate {
    city: string;
}

export interface Address {
    street: string;
    city: string;
}

export interface AddressResource extends Address, Resource {}

export interface Order {
    date: string;
}

export interface OrderResource extends Order, Resource {}

export interface OrderList {
    orders: Order[];
    totalOrders: number;
}

export interface OrderListResource extends Resource {
    _embedded: {
        orderList: OrderResource[];
        [key: string]: Resource | Resource[];
    };
}

export const address: AddressResource = {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    _links: {
        self: { href: "/users/1/address" },
    },
};

export const user: UserResource = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    _embedded: {
        address,
    },
    _links: {
        self: { href: "/users/1" },
        orders: { href: "/users/1/orders" },
        "place-order": { href: "/users/1/orders" },
    },
};
