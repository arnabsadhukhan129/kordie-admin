import { TestBed } from '@angular/core/testing';

import { InsightArticleService } from './insight-article.service';

describe('InsightArticleService', () => {
  let service: InsightArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsightArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
