import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcrIconComponent } from './icr-icon.component';

describe('IcrIconComponent', () => {
  let component: IcrIconComponent;
  let fixture: ComponentFixture<IcrIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcrIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcrIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
