import { TestBed } from '@angular/core/testing';

import { StudentSpeakService } from './student-speak.service';

describe('StudentSpeakService', () => {
  let service: StudentSpeakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentSpeakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
