import { TestBed, waitForAsync } from '@angular/core/testing';
import { RestModule } from './rest.module';

describe('RestModule', () => {
    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [RestModule]
            }).compileComponents();
        })
    );

    it('should create', () => {
        expect(RestModule).toBeDefined();
    });
});
