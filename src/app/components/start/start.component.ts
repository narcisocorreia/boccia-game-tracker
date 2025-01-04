import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {
  // Reactive Form
  playerForm = new FormGroup({
    redPlayer: new FormControl('', [Validators.required]), // Player 1 name field with validation
    bluePlayer: new FormControl('', [Validators.required]), // Player 2 name field with validation
  });

  constructor(private GameService: GameService, private router: Router) {}

  // Submit Function
  startGame(): void {
    if (this.playerForm.invalid) {
      return;
    }

    // Retrieve the values of player names
    const player1Name = this.playerForm.get('redPlayer')?.value;
    const player2Name = this.playerForm.get('bluePlayer')?.value;

    this.GameService.updatePlayerNames(player1Name!, player2Name!);
    // Add game-starting logic here

    // Navigate to the game route using Angular router
    this.router.navigate(['/game']);
  }
}
