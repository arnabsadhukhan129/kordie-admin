import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTimeComponent } from './add-edit-time.component';

describe('AddEditTimeComponent', () => {
  let component: AddEditTimeComponent;
  let fixture: ComponentFixture<AddEditTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
