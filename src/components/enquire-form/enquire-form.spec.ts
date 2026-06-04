import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquireForm } from './enquire-form';

describe('EnquireForm', () => {
  let component: EnquireForm;
  let fixture: ComponentFixture<EnquireForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquireForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquireForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
