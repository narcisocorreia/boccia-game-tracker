import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
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
    redPlayer: new FormControl('', [Validators.required]),
    bluePlayer: new FormControl('', [Validators.required]),
    redTimer: new FormControl('06:00', [
      Validators.required,
      this.timeValidator('02:00', '07:00'),
    ]),
    blueTimer: new FormControl('06:00', [
      Validators.required,
      this.timeValidator('02:00', '07:00'),
    ]),
  });

  settingsForm = new FormGroup({
    ends: new FormControl(4, [Validators.required]),
    timeBetweenEnds: new FormControl('01:00', [Validators.required]),
  });

  constructor(private GameService: GameService, private router: Router) {}

  // Custom Validator for Time
  private timeValidator(min: string, max: string) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) {
        return { required: true };
      }
      const [minMinutes, minSeconds] = min.split(':').map(Number);
      const [maxMinutes, maxSeconds] = max.split(':').map(Number);
      const [currentMinutes, currentSeconds] = value.split(':').map(Number);

      if (
        currentMinutes < minMinutes ||
        (currentMinutes === minMinutes && currentSeconds < minSeconds) ||
        currentMinutes > maxMinutes ||
        (currentMinutes === maxMinutes && currentSeconds > maxSeconds)
      ) {
        return { invalidTime: true };
      }
      return null;
    };
  }

  // Submit Function
  startGame(): void {
    if (this.playerForm.invalid || this.settingsForm.invalid) {
      return;
    }

    const redPlayer = this.playerForm.get('redPlayer')?.value;
    const bluePlayer = this.playerForm.get('bluePlayer')?.value;
    const ends = this.settingsForm.get('ends')?.value;
    const timeBetweenEnds = this.convertTimeToMinutes(
      this.settingsForm.get('timeBetweenEnds')?.value ?? '00:00'
    );
    const redTimer = this.convertTimeToMinutes(
      this.playerForm.value.redTimer ?? '00:00'
    );
    const blueTimer = this.convertTimeToMinutes(
      this.playerForm.value.blueTimer ?? '00:00'
    );

    this.GameService.setUpGame(
      redPlayer!,
      bluePlayer!,
      redTimer!,
      blueTimer!,
      ends!,
      timeBetweenEnds!
    );

    this.router.navigate(['/game']);
  }

  private convertTimeToMinutes(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }
}
