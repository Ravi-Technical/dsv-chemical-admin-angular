import { TestBed } from '@angular/core/testing';

import { MatSnackBar } from './mat-snack-bar';

describe('MatSnackBar', () => {
  let service: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
