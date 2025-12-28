import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Program1ListComponent } from './program1-list.component';

describe('Program1ListComponent', () => {
  let component: Program1ListComponent;
  let fixture: ComponentFixture<Program1ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Program1ListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Program1ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
