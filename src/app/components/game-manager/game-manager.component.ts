import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameService, Player } from '../../services/game.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
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

  constructor(private gameService: GameService, public dialog: MatDialog) {
    this.gameService.gameState.subscribe((state) => {
      this.redPlayer = state.redPlayer;
      this.bluePlayer = state.bluePlayer;
    });

    this.gameService.gameSettings.subscribe((settings) => {
      this.ends = Array(settings.ends);
      this.timeBetweenEnds = settings.timeBetweenEnds;
    });

    this.openTimerModal(1); // Open with a 2-minute timer on page load
  }

  openTimerModal(duration: number): void {
    this.dialog.open(TimerModalComponent, {
      panelClass: 'full-screen-dialog', // For fullscreen modal styling
      disableClose: true, // Prevent closing by clicking outside
      data: { duration }, // Pass the timer duration
    });
  }

  nextEnd(newEnd: number): void {
    this.currentEnd = newEnd;

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: `Pertende acabar o parcial ${this.currentEnd}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openTimerModal(this.timeBetweenEnds);
        this.redPlayerComponent.resetEnd();
        this.bluePlayerComponent.resetEnd();
      }
    });
  }
}
