import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryaccountComponent } from './recoveryaccount.component';

describe('RecoveryaccountComponent', () => {
  let component: RecoveryaccountComponent;
  let fixture: ComponentFixture<RecoveryaccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecoveryaccountComponent]
    });
    fixture = TestBed.createComponent(RecoveryaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
