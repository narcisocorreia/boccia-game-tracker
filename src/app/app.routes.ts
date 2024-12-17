import { Routes } from '@angular/router';
import { GameManagerComponent } from './components/game-manager/game-manager.component';

export const routes: Routes = [
  { path: '', component: GameManagerComponent },
  { path: '**', redirectTo: '' }, // Redirect unknown routes to the Configuration page
];
