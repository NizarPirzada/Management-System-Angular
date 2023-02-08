import { TestBed } from '@angular/core/testing';

import { QbauthService } from './qbauth.service';

describe('QbauthService', () => {
  let service: QbauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
