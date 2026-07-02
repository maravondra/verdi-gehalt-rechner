import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyBanner } from './privacy-banner';

describe('PrivacyBanner', () => {
  let component: PrivacyBanner;
  let fixture: ComponentFixture<PrivacyBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
