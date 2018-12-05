import { TestBed } from '@angular/core/testing';

import { MapRouteService } from './map-route.service';

describe('MapRouteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapRouteService = TestBed.get(MapRouteService);
    expect(service).toBeTruthy();
  });
});
