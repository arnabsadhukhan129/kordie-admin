import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledCourseListComponent } from './enrolled-course-list.component';

describe('EnrolledCourseListComponent', () => {
  let component: EnrolledCourseListComponent;
  let fixture: ComponentFixture<EnrolledCourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolledCourseListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
