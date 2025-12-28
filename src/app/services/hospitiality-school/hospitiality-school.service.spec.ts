import { TestBed } from '@angular/core/testing';

import { HospitialitySchoolService } from './hospitiality-school.service';

describe('HospitialitySchoolService', () => {
  let service: HospitialitySchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitialitySchoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
