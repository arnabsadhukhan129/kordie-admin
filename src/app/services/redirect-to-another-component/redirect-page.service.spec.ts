import { TestBed } from '@angular/core/testing';

import { RedirectPageService } from './redirect-page.service';

describe('RedirectPageService', () => {
  let service: RedirectPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedirectPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
