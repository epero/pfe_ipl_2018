import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoireComponent } from './trajectoire.component';

describe('TrajectoireComponent', () => {
  let component: TrajectoireComponent;
  let fixture: ComponentFixture<TrajectoireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajectoireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
