import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionTypeIconComponent } from './instruction-type-icon.component';

describe('InstructionTypeIconComponent', () => {
  let component: InstructionTypeIconComponent;
  let fixture: ComponentFixture<InstructionTypeIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructionTypeIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionTypeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
