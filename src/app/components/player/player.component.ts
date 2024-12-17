import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() name: string = 'Player';
  @Input() score: number = 0;
  @Input() color: 'red' | 'blue' = 'red';

  timerValue: number = 6 * 60;
  timerRunning: boolean = false;
  timerInterval: any;

  iconStates: boolean[] = Array(6).fill(false);

  get formattedTimer(): string {
    const minutes = Math.floor(this.timerValue / 60);
    const seconds = this.timerValue % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  toggleTimer() {
    if (this.timerRunning) {
      clearInterval(this.timerInterval);
    } else {
      this.timerInterval = setInterval(() => {
        if (this.timerValue > 0) {
          this.timerValue--;
        } else {
          clearInterval(this.timerInterval);
          this.timerRunning = false;
        }
      }, 1000);
    }
    this.timerRunning = !this.timerRunning;
  }

  increment() {
    this.score++;
  }

  decrement() {
    if (this.score > 0) this.score--;
  }

  // Toggle ball icon state
  toggleIcon(index: number) {
    this.iconStates[index] = !this.iconStates[index];
  }
}
