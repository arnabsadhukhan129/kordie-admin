import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Program3ListComponent } from './program3-list.component';

describe('Program3ListComponent', () => {
  let component: Program3ListComponent;
  let fixture: ComponentFixture<Program3ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Program3ListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Program3ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
