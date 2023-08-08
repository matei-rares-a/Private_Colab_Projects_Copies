import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorContComponent } from './error-cont.component';

describe('ErrorContComponent', () => {
  let component: ErrorContComponent;
  let fixture: ComponentFixture<ErrorContComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorContComponent]
    });
    fixture = TestBed.createComponent(ErrorContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
