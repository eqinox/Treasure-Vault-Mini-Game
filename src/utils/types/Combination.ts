import { GAME_CONFIG, Direction } from "../config";
import { GameState, CombinationResult } from "./index";

export class Combination {
  constructor(
    public readonly number: number,
    public readonly direction: Direction
  ) {}

  toString(): string {
    return `${this.number} ${this.direction}`;
  }

  static generateRandom(maxSpinLength: number): Combination {
    const number = Math.floor(Math.random() * maxSpinLength) + 1; // 1-9
    const direction = Math.random() < 0.5 ? Direction.CLOCKWISE : Direction.COUNTERCLOCKWISE;
    return new Combination(number, direction);
  }

  static generateSecretCombination(): Combination[] {
    const combinations: Combination[] = [];
    
    // Generate random combinations
    for (let i = 0; i < GAME_CONFIG.NUMBER_OF_COMBINATIONS; i++) {
      combinations.push(Combination.generateRandom(GAME_CONFIG.MAX_SPIN_LENGTH));
    }
    
    return combinations;
  }

  static checkCombination(gameState: GameState, inputDirection: Direction): CombinationResult {
    const expectedMove = gameState.secretCombination[gameState.currentStep];
    
    if (inputDirection === expectedMove.direction) {
      const newRotations = gameState.rotationsInCurrentDirection + 1;
      
      if (newRotations === expectedMove.number) {
        // Step completed, check if game is complete
        const shouldComplete = gameState.currentStep + 1 === gameState.secretCombination.length;
        return { isValid: true, shouldAdvance: true, shouldComplete };
      } else {
        // Step in progress
        return { isValid: true, shouldAdvance: false, shouldComplete: false };
      }
    } else {
      // Wrong direction
      return { isValid: false, shouldAdvance: false, shouldComplete: false };
    }
  }
} 