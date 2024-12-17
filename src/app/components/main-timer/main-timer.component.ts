import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-timer',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, DatePipe],
  templateUrl: './main-timer.component.html',
  styleUrls: ['./main-timer.component.scss'],
})
export class MainTimerComponent {
  timer = 120 * 1000;
  running = false;
  interval: any;

  constructor(private router: Router) {}

  toggleTimer() {
    if (this.running) {
      clearInterval(this.interval);
    } else {
      this.interval = setInterval(() => {
        this.timer -= 1000;
        if (this.timer <= 0) clearInterval(this.interval);
      }, 1000);
    }
    this.running = !this.running;
  }

  goToGameManager() {
    this.router.navigate(['/manager']);
  }
}
