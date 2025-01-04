import { Routes } from '@angular/router';
import { GameManagerComponent } from './components/game-manager/game-manager.component';
import { StartComponent } from './components/start/start.component';

export const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'game', component: GameManagerComponent },
  { path: '**', redirectTo: '' }, // Redirect unknown routes to the Configuration page
];
