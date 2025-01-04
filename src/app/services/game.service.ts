import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private gameStateSubject: BehaviorSubject<{
    redPlayer: string;
    bluePlayer: string;
  }> = new BehaviorSubject<{
    redPlayer: string;
    bluePlayer: string;
  }>({
    redPlayer: '',
    bluePlayer: '',
  });

  /**
   * Observable to expose the current state of the game.
   * @public
   */
  public gameState: Observable<{ redPlayer: string; bluePlayer: string }> =
    this.gameStateSubject.asObservable();

  /**
   * Updates the names of the players.
   * @param redPlayer - The name of the red player.
   * @param bluePlayer - The name of the blue player.
   */
  public updatePlayerNames(redPlayer: string, bluePlayer: string): void {
    this.gameStateSubject.next({ redPlayer, bluePlayer });
  }
}
