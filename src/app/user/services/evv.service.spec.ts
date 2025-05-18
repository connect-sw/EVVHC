import { TestBed } from '@angular/core/testing';

import { EvvService } from './evv.service';

describe('EvvService', () => {
  let service: EvvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
