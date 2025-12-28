import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTaughtByComponent } from './add-edit-taught-by.component';

describe('AddEditTaughtByComponent', () => {
  let component: AddEditTaughtByComponent;
  let fixture: ComponentFixture<AddEditTaughtByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTaughtByComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTaughtByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
