import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Program2ListComponent } from './program2-list.component';

describe('Program2ListComponent', () => {
  let component: Program2ListComponent;
  let fixture: ComponentFixture<Program2ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Program2ListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Program2ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
