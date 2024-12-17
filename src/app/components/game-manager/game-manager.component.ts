import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-game-manager',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.scss'],
})
export class GameManagerComponent {
  score1 = 0;
  score2 = 0;

  // Function to update Player 1's score
  updateScore(player: 'player1' | 'player2', increment: number) {
    if (player === 'player1') {
      this.score1 += increment;
    } else if (player === 'player2') {
      this.score2 += increment;
    }
  }
}
