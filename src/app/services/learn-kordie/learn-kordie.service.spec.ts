import { TestBed } from '@angular/core/testing';

import { LearnKordieService } from './learn-kordie.service';

describe('LearnKordieService', () => {
  let service: LearnKordieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnKordieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
