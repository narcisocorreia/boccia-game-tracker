import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GameService, Player, Turn } from '../../services/game.service';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  @Input() player: Player | undefined;
  @Input() score: number | undefined = 0;
  @Input() color: 'red' | 'blue' = 'red';

  timerRunning: boolean = false;
  timerInterval: any;
  timer: number = 360; // 6 minutes

  iconStates: boolean[] = Array(6).fill(false);
  turnScore: number = 0;

  constructor(
    private gameService: GameService,
    private timeService: TimeService
  ) {}

  ngOnInit() {
    if (this.player) {
      this.timer = this.player.timer;
    }
  }

  get formattedTimer(): string {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  toggleTimer() {
    if (this.timerRunning) {
      clearInterval(this.timerInterval);
    } else {
      this.timerInterval = setInterval(() => {
        if (this.timeService.areTimersPaused()) {
          return; // Do nothing while globally paused
        }

        if (this.timer > 0) {
          this.timer--;

          // Play sounds at specific times
          if (this.timer === 60) {
            new Audio('assets/1.mp3').play();
          } else if (this.timer === 30) {
            new Audio('assets/30.mp3').play();
          } else if (this.timer === 10) {
            new Audio('assets/10.mp3').play();
          }
        } else {
          clearInterval(this.timerInterval);
          this.timerRunning = false;
          new Audio('assets/time.mp3').play(); // Play sound when time ends
        }
      }, 1000);
    }
    this.timerRunning = !this.timerRunning;
  }

  increment() {
    this.turnScore++;
    if (this.color === 'red') {
      this.gameService.updateRedPlayerScore(this.player!.score + 1);
    } else {
      this.gameService.updateBluePlayerScore(this.player!.score + 1);
    }
  }

  decrement() {
    if (this.player!.score > 0) {
      this.turnScore--;
      if (this.color === 'red') {
        this.gameService.updateRedPlayerScore(this.player!.score - 1);
      } else {
        this.gameService.updateBluePlayerScore(this.player!.score - 1);
      }
    }
  }

  // Toggle ball icon state
  toggleIcon(index: number) {
    this.iconStates[index] = !this.iconStates[index];
  }

  resetEnd(): void {
    const turn = this.createTurn();
    if (this.color === 'red') {
      this.gameService.saveRedPlayerTurn(turn);
    } else {
      this.gameService.saveBluePlayerTurn(turn);
    }
    this.iconStates = Array(6).fill(false);
    this.timer = this.player!.timer;
    this.turnScore = 0;
  }

  createTurn(): Turn {
    const ballsUsed = this.iconStates.filter((state) => state).length;
    const formattedTime = this.formattedTimer;
    return {
      score: this.turnScore,
      time: formattedTime,
      balls: ballsUsed,
    };
  }
}
