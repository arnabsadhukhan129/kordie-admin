import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedUserViewComponent } from './subscribed-user-view.component';

describe('SubscribedUserViewComponent', () => {
  let component: SubscribedUserViewComponent;
  let fixture: ComponentFixture<SubscribedUserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribedUserViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribedUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
