import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProgram3Component } from './create-program3.component';

describe('CreateProgram3Component', () => {
  let component: CreateProgram3Component;
  let fixture: ComponentFixture<CreateProgram3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProgram3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProgram3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
