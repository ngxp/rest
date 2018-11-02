import { async, TestBed } from '@angular/core/testing';
import { RestModule } from './rest.module';

describe('RestModule', () => {
    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                imports: [RestModule]
            }).compileComponents();
        })
    );

    it('should create', () => {
        expect(RestModule).toBeDefined();
    });
});
