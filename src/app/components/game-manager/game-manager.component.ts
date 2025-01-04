import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game-manager',
  standalone: true,
  imports: [PlayerComponent],
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.scss'],
})
export class GameManagerComponent {
  redPlayer: string = '';
  bluePlayer: string = '';
  constructor(private gameService: GameService) {
    this.gameService.gameState.subscribe((state) => {
      this.redPlayer = state.redPlayer;
      this.bluePlayer = state.bluePlayer;
    });
  }
}
