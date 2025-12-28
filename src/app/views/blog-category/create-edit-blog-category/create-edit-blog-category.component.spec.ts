import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditBlogCategoryComponent } from './create-edit-blog-category.component';

describe('CreateEditBlogCategoryComponent', () => {
  let component: CreateEditBlogCategoryComponent;
  let fixture: ComponentFixture<CreateEditBlogCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditBlogCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditBlogCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
