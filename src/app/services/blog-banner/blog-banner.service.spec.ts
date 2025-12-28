import { TestBed } from '@angular/core/testing';

import { BlogBannerService } from './blog-banner.service';

describe('BlogBannerService', () => {
  let service: BlogBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
