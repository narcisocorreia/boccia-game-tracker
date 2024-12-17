import { Component } from '@angular/core';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game-manager',
  standalone: true,
  imports: [PlayerComponent],
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.scss'],
})
export class GameManagerComponent {}
