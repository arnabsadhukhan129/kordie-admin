import { TestBed } from '@angular/core/testing';

import { Program3Service } from './program3.service';

describe('Program3Service', () => {
  let service: Program3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Program3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
