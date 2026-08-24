import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlShotForm } from './url-shot-form';

describe('UrlShotForm', () => {
  let component: UrlShotForm;
  let fixture: ComponentFixture<UrlShotForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlShotForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlShotForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
