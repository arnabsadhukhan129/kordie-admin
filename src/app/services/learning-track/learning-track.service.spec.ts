import { TestBed } from '@angular/core/testing';

import { LearningTrackService } from './learning-track.service';

describe('LearningTrackService', () => {
  let service: LearningTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
