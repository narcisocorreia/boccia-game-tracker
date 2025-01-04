import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerModalComponent } from './timer-modal.component';

describe('TimerModalComponent', () => {
  let component: TimerModalComponent;
  let fixture: ComponentFixture<TimerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
