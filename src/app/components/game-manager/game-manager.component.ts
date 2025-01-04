import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from '../../services/game.service';
import { PlayerComponent } from '../player/player.component';
import { TimerModalComponent } from '../timer-modal/timer-modal.component';

@Component({
  selector: 'app-game-manager',
  standalone: true,
  imports: [PlayerComponent],
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.scss'],
})
export class GameManagerComponent {
  title: string = 'Boccia Game Tracker';
  redPlayer: string = '';
  bluePlayer: string = '';
  currentPartial: number = 1; // Starts at partial 1

  constructor(private gameService: GameService, public dialog: MatDialog) {
    this.gameService.gameState.subscribe((state) => {
      this.redPlayer = state.redPlayer;
      this.bluePlayer = state.bluePlayer;
    });

    this.openTimerModal(120); // Open with a 2-minute timer on page load
  }

  openTimerModal(duration: number): void {
    this.dialog.open(TimerModalComponent, {
      panelClass: 'full-screen-dialog', // For fullscreen modal styling
      disableClose: true, // Prevent closing by clicking outside
      data: { duration }, // Pass the timer duration
    });
  }
}
