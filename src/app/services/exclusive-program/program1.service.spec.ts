import { TestBed } from '@angular/core/testing';

import { Program1Service } from './program1.service';

describe('Program1Service', () => {
  let service: Program1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Program1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
