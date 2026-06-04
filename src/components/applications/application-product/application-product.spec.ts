import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationProduct } from './application-product';

describe('ApplicationProduct', () => {
  let component: ApplicationProduct;
  let fixture: ComponentFixture<ApplicationProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
