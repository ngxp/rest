import { cloneDeep } from 'lodash-es';
import { Multipart } from '../../src/lib/multipart.model';
import { getEmbeddedResource, getUrl, toUriList } from '../../src/lib/resource-utils';
import { getUser } from './domain';
import { OrderResource } from './domain.model';
import { getAddressResource, getOrderListResource } from './resource';

const multipart: Multipart = {
    user: {
        contentType: 'application/json',
        data: getUser()
    },
    address: {
        contentType: 'text/uri-list',
        data: getUrl(getAddressResource())
    },
    orders: {
        contentType: 'text/uri-list',
        data: toUriList(getEmbeddedResource<OrderResource[]>(getOrderListResource(), 'orderList')).join('\n')
    }
};

export function getMultipart() {
    return cloneDeep(multipart);
}
