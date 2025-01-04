import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-timer-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-modal.component.html',
  styleUrl: './timer-modal.component.scss',
})
export class TimerModalComponent implements OnInit {
  minutes: number = 0;
  seconds: number = 0;
  interval: any;

  constructor(
    public dialogRef: MatDialogRef<TimerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { duration: number } // Accept duration as input
  ) {}

  ngOnInit(): void {
    this.initializeTimer(this.data.duration || 120); // Default to 2 minutes
  }

  initializeTimer(duration: number): void {
    this.minutes = Math.floor(duration / 60);
    this.seconds = duration % 60;
    this.startTimer();
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.seconds === 0 && this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else if (this.seconds > 0) {
        this.seconds--;
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.interval);
    this.dialogRef.close(); // Automatically close the modal
  }
}
