import { TestBed } from '@angular/core/testing';

import { GraphApiCallerService } from './graph-api-caller.service';

describe('GraphApiCallerService', () => {
  let service: GraphApiCallerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphApiCallerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
