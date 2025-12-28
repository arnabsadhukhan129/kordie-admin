import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInterestComponent } from './add-edit-interest.component';

describe('AddEditInterestComponent', () => {
  let component: AddEditInterestComponent;
  let fixture: ComponentFixture<AddEditInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditInterestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
