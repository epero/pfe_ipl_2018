import { TestBed } from '@angular/core/testing';

import { DisplayAlertService } from './display-alert.service';

describe('DisplayAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisplayAlertService = TestBed.get(DisplayAlertService);
    expect(service).toBeTruthy();
  });
});
