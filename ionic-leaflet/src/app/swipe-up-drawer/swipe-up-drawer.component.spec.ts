import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeUpDrawerComponent } from './swipe-up-drawer.component';

describe('SwipeUpDrawerComponent', () => {
  let component: SwipeUpDrawerComponent;
  let fixture: ComponentFixture<SwipeUpDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeUpDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeUpDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
