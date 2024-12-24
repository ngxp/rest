import { faker } from "@faker-js/faker";
import { cloneDeep, pick, times } from "lodash-es";
import { Address, AddressCityUpdate, Order, User } from "./domain.model";

const users: User[] = times(5, () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
}));

const address: Address = {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
};

const updatedAddress = cloneDeep(address);
updatedAddress.city = faker.location.city();

const orders: Order[] = [
    {
        date: new Date().toDateString(),
    },
    {
        date: new Date().toDateString(),
    },
];

export function getUsers(): User[] {
    return cloneDeep(users);
}

export function getUser(): User {
    return cloneDeep(users[0]);
}

export function getAddress(): Address {
    return cloneDeep(address);
}

export function getUpdatedAddress(): Address {
    return cloneDeep(updatedAddress);
}

export function getPartialAddress(): AddressCityUpdate {
    return <AddressCityUpdate>pick(cloneDeep(updatedAddress), ["city"]);
}

export function getOrders(): Order[] {
    return cloneDeep(orders);
}

export function getOrder(): Order {
    return cloneDeep(orders[0]);
}
