import { TestBed } from '@angular/core/testing';

import { WhyKordieService } from './why-kordie.service';

describe('WhyKordieService', () => {
  let service: WhyKordieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhyKordieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
