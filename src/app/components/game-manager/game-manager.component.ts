import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameService, Player } from '../../services/game.service';
import { TimeService } from '../../services/time.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { EndGameModalComponent } from '../end-game-modal/end-game-modal.component';
import { PlayerComponent } from '../player/player.component';
import { TimerModalComponent } from '../timer-modal/timer-modal.component';

const GAME_START_TIME = 120; // 2 minutes

@Component({
  selector: 'app-game-manager',
  standalone: true,
  imports: [PlayerComponent, CommonModule],
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.scss'],
})
export class GameManagerComponent {
  title: string = 'Boccia Game Tracker';
  redPlayer: Player | undefined;
  bluePlayer: Player | undefined;
  ends: number[] = []; // Default to 4 ends
  currentEnd: number = 1; // Starts at partial 1
  timeBetweenEnds: number = 60; // Default to 1 minute
  hoveredIndex: number | null = null;

  // Reference to PlayerComponents
  @ViewChild('redPlayerComponent') redPlayerComponent!: PlayerComponent;
  @ViewChild('bluePlayerComponent') bluePlayerComponent!: PlayerComponent;

  constructor(
    private gameService: GameService,
    private timeService: TimeService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.gameService.gameState.subscribe((state) => {
      this.redPlayer = state.redPlayer;
      this.bluePlayer = state.bluePlayer;
    });

    this.gameService.gameSettings.subscribe((settings) => {
      this.ends = Array(settings.ends);
      this.timeBetweenEnds = settings.timeBetweenEnds;
    });

    this.openTimerModal(GAME_START_TIME); // Open with a 2-minute timer on page load
  }

  openTimerModal(duration: number): void {
    this.dialog.open(TimerModalComponent, {
      panelClass: 'full-screen-dialog', // For fullscreen modal styling
      disableClose: true, // Prevent closing by clicking outside
      data: { duration }, // Pass the timer duration
    });
  }

  nextEnd(newEnd: number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: `Pertende acabar o parcial ${this.currentEnd}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.currentEnd = newEnd;
        this.openTimerModal(this.timeBetweenEnds);
        this.redPlayerComponent.resetEnd();
        this.bluePlayerComponent.resetEnd();
      }
    });
  }

  extraTurn(): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: `Pertende começar um parcial extra?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.currentEnd = this.currentEnd++;
        this.openTimerModal(this.timeBetweenEnds);
        this.redPlayerComponent.resetEnd();
        this.bluePlayerComponent.resetEnd();
      }
    });
  }

  endGame(): void {
    const dialogRef = this.dialog.open(EndGameModalComponent, {
      panelClass: 'full-screen-dialog', // For fullscreen modal styling
      disableClose: true, // Prevent closing by clicking outside
      data: {
        redPLayer: this.redPlayer,
        bluePlayer: this.bluePlayer,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.redPlayerComponent.resetEnd();
        this.bluePlayerComponent.resetEnd();
        this.gameService.createGameStatsPDF(); // Generate and download the PDF file
        this.timeService.resumeTimers(); // Resume timers when modal closes
        this.router.navigate(['']);
      }
    });
  }
}
