import { Routes } from '@angular/router';
import { GameManagerComponent } from './components/game-manager/game-manager.component';
import { StartComponent } from './components/start/start.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from './services/game.service';

export const routes: Routes = [
  { path: '', component: StartComponent },
  {
    path: 'game',
    component: GameManagerComponent,
    canActivate: [() => {
      const router = inject(Router);
      const gameService = inject(GameService);
      const gameState = gameService.getGameState();
      if (!gameState.redPlayer.name || !gameState.bluePlayer.name) {
        router.navigate(['/']);
        return false;
      }
      return true;
    }],
  },
  { path: '**', redirectTo: '' },
];
