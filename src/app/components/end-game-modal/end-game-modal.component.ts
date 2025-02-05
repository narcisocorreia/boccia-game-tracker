import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Player } from '../../services/game.service';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-end-game-modal',
  standalone: true,
  imports: [],
  templateUrl: './end-game-modal.component.html',
  styleUrl: './end-game-modal.component.scss',
})
export class EndGameModalComponent implements OnInit {
  redPlayer: Player | undefined;
  bluePlayer: Player | undefined;

  constructor(
    private timeService: TimeService,
    private router: Router,
    public dialogRef: MatDialogRef<EndGameModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { redPLayer: Player; bluePlayer: Player } // Accept duration as input
  ) {}

  ngOnInit(): void {
    this.redPlayer = this.data.redPLayer;
    this.bluePlayer = this.data.bluePlayer;
    this.timeService.pauseTimers(); // Stop all timers when modal opens
  }

  confirmEndGame(): void {
    this.dialogRef.close(); // Automatically close the modal
    this.timeService.resumeTimers(); // Resume timers when modal closes
    this.router.navigate(['']);
  }

  cancelEndGame(): void {
    this.dialogRef.close(); // Automatically close the modal
    this.timeService.resumeTimers(); // Resume timers when modal closes
  }
}
