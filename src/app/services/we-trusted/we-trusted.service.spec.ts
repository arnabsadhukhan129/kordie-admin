import { TestBed } from '@angular/core/testing';

import { WeTrustedService } from './we-trusted.service';

describe('WeTrustedService', () => {
  let service: WeTrustedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeTrustedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
