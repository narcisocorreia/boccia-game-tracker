import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BehaviorSubject, Observable } from 'rxjs';

export type Player = {
  name: string;
  score: number;
  timer: number;
  turns: Turn[];
};

export type Turn = {
  score: number;
  time: string; // Update to string
  balls: number;
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
        name: '',
        score: 0,
        timer: 360, // 6 minutes
        turns: [],
      },
      bluePlayer: { name: '', score: 0, timer: 360, turns: [] },
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
      redPlayer: {
        name: redPlayerName,
        score: 0,
        timer: redPlayerTimer,
        turns: [],
      },
      bluePlayer: {
        name: bluePlayerName,
        score: 0,
        timer: bluePlayerTimer,
        turns: [],
      },
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

  /**
   * Saves the turn for the red player.
   * @param turn - The turn object to be saved.
   */
  public saveRedPlayerTurn(turn: Turn): void {
    const currentState = this.gameStateSubject.value;
    const updatedTurns = [...currentState.redPlayer.turns, turn];
    this.gameStateSubject.next({
      ...currentState,
      redPlayer: { ...currentState.redPlayer, turns: updatedTurns },
    });
  }

  /**
   * Saves the turn for the blue player.
   * @param turn - The turn object to be saved.
   */
  public saveBluePlayerTurn(turn: Turn): void {
    const currentState = this.gameStateSubject.value;
    const updatedTurns = [...currentState.bluePlayer.turns, turn];
    this.gameStateSubject.next({
      ...currentState,
      bluePlayer: { ...currentState.bluePlayer, turns: updatedTurns },
    });
  }

  /**
   * Creates a PDF document with the final score and details of each turn for both players.
   */
  public createGameStatsPDF(): void {
    const currentState = this.gameStateSubject.value;
    const doc = new jsPDF();

    const gameStats = {
      redPlayer: {
        finalScore: currentState.redPlayer.score,
        numberOfTurns: currentState.redPlayer.turns.length,
        turns: currentState.redPlayer.turns.map((turn) => ({
          score: turn.score,
          timeUsed: turn.time,
          ballsUsed: turn.balls,
        })),
      },
      bluePlayer: {
        finalScore: currentState.bluePlayer.score,
        numberOfTurns: currentState.bluePlayer.turns.length,
        turns: currentState.bluePlayer.turns.map((turn) => ({
          score: turn.score,
          timeUsed: turn.time,
          ballsUsed: turn.balls,
        })),
      },
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(
      `${currentState.redPlayer.name} vs ${currentState.bluePlayer.name}`,
      105,
      15,
      { align: 'center' }
    );

    // Final Score
    doc.setFontSize(14);
    doc.text('Resultado Final', 105, 30, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(200, 0, 0); // Red Player
    doc.text(
      `${currentState.redPlayer.name}: ${currentState.redPlayer.score} pontos`,
      20,
      40
    );

    doc.setTextColor(0, 0, 200); // Blue Player
    doc.text(
      `${currentState.bluePlayer.name}: ${currentState.bluePlayer.score} pontos`,
      20,
      50
    );

    // Reset text color
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    let yOffset = 60; // Start position for tables

    // Generate a separate table for each turn
    gameStats.redPlayer.turns.forEach((turn, index) => {
      const tableColumn = ['Jogador', 'Pontuação', 'Tempo', 'Bolas Usadas'];
      const tableRows: any[] = [];

      tableRows.push([
        currentState.redPlayer.name,
        turn.score,
        turn.timeUsed,
        turn.ballsUsed,
      ]);

      tableRows.push([
        currentState.bluePlayer.name,
        gameStats.bluePlayer.turns[index].score,
        gameStats.bluePlayer.turns[index].timeUsed,
        gameStats.bluePlayer.turns[index].ballsUsed,
      ]);

      // Add Turn Header
      doc.setFont('helvetica', 'bold');
      doc.text(`Turno ${index + 1}`, 20, yOffset);

      // Generate Table
      (doc as any).autoTable({
        startY: yOffset + 5,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 20, right: 20 },
      });

      yOffset = (doc as any).lastAutoTable.finalY + 10; // Update yOffset for next table
    });

    // Save PDF
    doc.save(
      `${currentState.redPlayer.name}_vs_${currentState.bluePlayer.name}.pdf`
    );
  }

  /**
   * Resets the game state and settings to their initial values.
   */
  public resetGame(): void {
    this.gameStateSubject.next({
      redPlayer: {
        name: '',
        score: 0,
        timer: 360, // 6 minutes
        turns: [],
      },
      bluePlayer: {
        name: '',
        score: 0,
        timer: 360, // 6 minutes
        turns: [],
      },
    });

    this.gameSettingsSubject.next({
      ends: 6,
      timeBetweenEnds: 60,
    });
  }

  getGameState() {
    return this.gameStateSubject.value;
  }
}
