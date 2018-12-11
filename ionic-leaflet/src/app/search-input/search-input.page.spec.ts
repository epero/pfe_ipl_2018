import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInputPage } from './search-input.page';

describe('SearchInputPage', () => {
  let component: SearchInputPage;
  let fixture: ComponentFixture<SearchInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchInputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
