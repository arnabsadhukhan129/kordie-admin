import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditIndustryComponent } from './add-edit-industry.component';

describe('AddEditIndustryComponent', () => {
  let component: AddEditIndustryComponent;
  let fixture: ComponentFixture<AddEditIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditIndustryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
