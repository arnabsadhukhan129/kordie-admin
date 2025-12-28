import { TestBed } from '@angular/core/testing';

import { CuratorsService } from './curators.service';

describe('CuratorsService', () => {
  let service: CuratorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuratorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
