import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Player = {
  name: string;
  score: number;
  timer: number;
};

type GameState = {
  redPlayer: Player;
  bluePlayer: Player;
};

type GameStetting = {
  ends: number;
  timeBetweenEnds: number;
};

@Injectable({
  providedIn: 'root',
})
/**
 * Service to manage the state of the game.
 */
export class GameService {
  /**
   * Subject to hold the current state of the game.
   * @private
   */
  private gameStateSubject: BehaviorSubject<GameState> =
    new BehaviorSubject<GameState>({
      redPlayer: {
        name: 'Alice',
        score: 0,
        timer: 60,
      },
      bluePlayer: { name: 'Bob', score: 0, timer: 60 },
    });

  /**
   * Observable to expose the current state of the game.
   * @public
   */
  public gameState: Observable<GameState> =
    this.gameStateSubject.asObservable();

  /**
   * Subject to hold the current settings of the game.
   * @private
   */
  private gameSettingsSubject: BehaviorSubject<GameStetting> =
    new BehaviorSubject<GameStetting>({
      ends: 6,
      timeBetweenEnds: 60,
    });

  /**
   * Observable to expose the current settings of the game.
   * @public
   */
  public gameSettings: Observable<GameStetting> =
    this.gameSettingsSubject.asObservable();

  /**
   * Sets up the game with the provided player names, timers, and settings.
   * @param redPlayerName - The name of the red player.
   * @param bluePlayerName - The name of the blue player.
   * @param redPlayerTimer - The timer setting for the red player.
   * @param bluePlayerTimer - The timer setting for the blue player.
   * @param ends - The number of ends in the game.
   * @param gameTimer - The timer setting for the game.
   */
  public setUpGame(
    redPlayerName: string,
    bluePlayerName: string,
    redPlayerTimer: number,
    bluePlayerTimer: number,
    ends: number,
    timeBetweenEnds: number
  ): void {
    this.gameStateSubject.next({
      redPlayer: { name: redPlayerName, score: 0, timer: redPlayerTimer },
      bluePlayer: { name: bluePlayerName, score: 0, timer: bluePlayerTimer },
    });
    this.gameSettingsSubject.next({ ends, timeBetweenEnds });
  }

  /**
   * Updates the score of the red player.
   * @param score - The new score for the red player.
   */
  public updateRedPlayerScore(score: number): void {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      redPlayer: { ...currentState.redPlayer, score },
    });
  }

  /**
   * Updates the score of the blue player.
   * @param score - The new score for the blue player.
   */
  public updateBluePlayerScore(score: number): void {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      bluePlayer: { ...currentState.bluePlayer, score },
    });
  }
}
