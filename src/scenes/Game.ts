import { Container, Sprite } from "pixi.js";
import { SceneUtils } from "../core/App";
import { VaultDoor } from "../components/VaultDoor";
import { Timer } from "../components/Timer";
import { GAME_CONFIG, Direction, GameStatus } from "../utils/config";
import { Combination } from "../utils/types/Combination";
import { GameState, CombinationResult } from "../utils/types/index";
import { wait } from "../utils/index";

export default class Game extends Container {
  name = "Treasure Vault";
  private background!: Sprite;
  private vaultDoor!: VaultDoor;
  private timer!: Timer;
  
  // Game state
  private gameState: GameState = {
    currentStep: 0,
    rotationsInCurrentDirection: 0,
    secretCombination: [],
    gameStatus: GameStatus.NORMAL
  };

  constructor(protected utils: SceneUtils) {
    super();    
  }

  async load() {
    await this.utils.assetLoader.loadAssets();
  }

  async start() {
    this.removeChildren();

    this.background = Sprite.from("/assets/bg.png");
    this.vaultDoor = new VaultDoor();
    
    this.timer = new Timer();
    
    this.resize(window.innerWidth, window.innerHeight);

    this.addChild(this.background, this.vaultDoor, this.timer);
    
    this.vaultDoor.setupHandleInteraction(this.onHandleClick.bind(this));

    this.timer.start();
    this.gameState.secretCombination = Combination.generateSecretCombination();
    this.logSecretCombination();
    this.logCurrentStep();
  }

  private resetSecretCombination() {
    this.gameState.currentStep = 0;
    this.gameState.rotationsInCurrentDirection = 0;
    this.gameState.secretCombination = Combination.generateSecretCombination();
    this.gameState.gameStatus = GameStatus.NORMAL;
  }

  private async onHandleClick(direction: Direction) {
    this.vaultDoor.rotateHandle(direction);    
    
    const result: CombinationResult = Combination.checkCombination(this.gameState, direction);
    
    this.updateGameState(result);
    this.logCurrentStep();
    
    if (this.gameState.gameStatus === GameStatus.WIN) {
      await this.handleWin();
      this.resetSecretCombination();
      this.logSecretCombination();
      this.timer.start();
    } else if (this.gameState.gameStatus === GameStatus.FAILURE) {
      await this.handleFailure();
      this.resetSecretCombination();
      this.logSecretCombination();
    }
  }

  private logSecretCombination() {
    console.log("Secret combination:",this.gameState.secretCombination.map(c => c.toString()).join(", "));
  }

  private updateGameState(result: CombinationResult) {
    if (result.isValid) {
      this.gameState.rotationsInCurrentDirection++;
      
      if (result.shouldAdvance) {
        this.gameState.currentStep++;
        this.gameState.rotationsInCurrentDirection = 0;
        
        if (result.shouldComplete) {
          this.gameState.gameStatus = GameStatus.WIN;
        }
      }
    } else {
      this.gameState.gameStatus = GameStatus.FAILURE;
    }
  }

  private logCurrentStep() {
    const { currentStep, secretCombination, rotationsInCurrentDirection, gameStatus } = this.gameState;
    
    switch (gameStatus) {
      case GameStatus.WIN:
        const elapsedTime = this.timer.getElapsedTime();
        const seconds = (elapsedTime / 1000).toFixed(2);
        console.log(`Vault unlocked in ${seconds} seconds!`);
        break;
      case GameStatus.FAILURE:
        console.log("Wrong combination! Resetting...");
        break;
      case GameStatus.NORMAL:
        if (currentStep < secretCombination.length) {
          const current = secretCombination[currentStep];
          console.log(`Current step ${currentStep + 1}: ${current.toString()} (${rotationsInCurrentDirection} rotations made)`);
        }
        break;
    }
  }

  private async handleWin() {
    this.timer.stop();
    
    await this.vaultDoor.open();

    await wait(GAME_CONFIG.DELAY_SECONDS_AFTER_WINNING);
    await this.vaultDoor.close();
    await this.vaultDoor.spinHandleCrazy();
  }

  private async handleFailure() {
    await this.vaultDoor.spinHandleCrazy();
  }

  private resize(width: number, height: number) {
    // Scale background to maintain the same visual appearance as full screen
    // Calculate scale based on the smaller dimension to maintain aspect ratio
    const bgNaturalWidth = this.background.texture.width;
    const bgNaturalHeight = this.background.texture.height;

    const scaleX = width / bgNaturalWidth;
    const scaleY = height / bgNaturalHeight;
    
    const scale = Math.min(scaleX, scaleY); // Use smaller scale to fit within window
    
    this.background.scale.set(scale);
    this.background.x = (width - bgNaturalWidth * scale) / 2;
    this.background.y = (height - bgNaturalHeight * scale) / 2;

    // Center the door to be in the middle of the vault
    this.vaultDoor.setScale(scale);
    this.vaultDoor.setPosition(
      width  / 2,
      height  / 2
    );
    
    // Position timer within the background bounds
    const timerPadding = 20 * scale;
    const timerX = this.background.x + timerPadding;
    const timerY = this.background.y + timerPadding;
    this.timer.setPosition(timerX, timerY);
  }

  onResize(width: number, height: number) {
    this.resize(width, height);
  }

  update(_delta: number) {
    // This method is required by the PIXI.js ticker
    // We can use it later for continuous animations if needed
  }
}