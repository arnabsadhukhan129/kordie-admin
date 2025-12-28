import { TestBed } from '@angular/core/testing';

import { Program2Service } from './program2.service';

describe('Program2Service', () => {
  let service: Program2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Program2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
