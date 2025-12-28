import { TestBed } from '@angular/core/testing';

import { HighEndGranularService } from './high-end-granular.service';

describe('HighEndGranularService', () => {
  let service: HighEndGranularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighEndGranularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
