import { Combination } from "./Combination";
import { GameStatus } from "../config";

export interface GameState {
  currentStep: number;
  rotationsInCurrentDirection: number;
  secretCombination: Combination[];
  gameStatus: GameStatus;
} 