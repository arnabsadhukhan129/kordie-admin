import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProgram2Component } from './create-program2.component';

describe('CreateProgram2Component', () => {
  let component: CreateProgram2Component;
  let fixture: ComponentFixture<CreateProgram2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProgram2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProgram2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
