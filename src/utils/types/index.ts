import { Combination } from "./Combination";
import { GameStatus } from "../config";

export interface CombinationResult {
    isValid: boolean;
    shouldAdvance: boolean;
    shouldComplete: boolean;
}

export interface GameState {
  currentStep: number;
  rotationsInCurrentDirection: number;
  secretCombination: Combination[];
  gameStatus: GameStatus;
} 