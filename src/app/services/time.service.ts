import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  private timersPaused = false;

  pauseTimers() {
    this.timersPaused = true;
  }

  resumeTimers() {
    this.timersPaused = false;
  }

  areTimersPaused(): boolean {
    return this.timersPaused;
  }
}
