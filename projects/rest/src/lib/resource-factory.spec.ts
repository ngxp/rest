import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { getUserResource } from '../../test';
import { ResourceFactory } from './resource-factory';
import { getUrl } from './resource-utils';
import { ResourceWrapper } from './resource-wrapper';
import { RestModule } from './rest.module';

describe('ResourceFactory', () => {
    let resourceFactory: ResourceFactory;
    const resource = getUserResource();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RestModule
            ],
            providers: [
                ResourceFactory
            ]
        });

        resourceFactory = TestBed.get(ResourceFactory);
    });

    it('should be initialized', () => {
        expect(resourceFactory).toBeTruthy();
    });

    describe('from', () => {
        it(`returns a ResourceWrapper instance for the given resource`, () => {
            expect(resourceFactory.from(resource)).toBeInstanceOf(ResourceWrapper);
        });
    });

    describe('fromid', () => {
        it(`returns a ResourceWrapper instance for the given resource ID`, () => {
            expect(resourceFactory.fromId(getUrl(resource))).toBeInstanceOf(ResourceWrapper);
        });
    });
});
