import { Container, Sprite } from "pixi.js";
import { SceneUtils } from "../core/App";
import { VaultDoor } from "../components/VaultDoor";
import { VaultHandle } from "../components/VaultHandle";
import { GlitterEffect } from "../components/GlitterEffect";
import { Timer } from "../components/Timer";

interface Combination {
  number: number;
  direction: "clockwise" | "counterclockwise";
}

export default class Game extends Container {
  name = "Treasure Vault";
  private background!: Sprite;
  private vaultDoor!: VaultDoor;
  private vaultHandle!: VaultHandle;
  private glitterEffect!: GlitterEffect;
  private timer!: Timer;
  
  // Game state
  private secretCombination: Combination[] = [];
  private currentStep = 0;
  private rotationsInCurrentDirection = 0;

  private numberOfCombinations = 3;
  private numberOfMaxSpinLength = 9;

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
    this.vaultHandle = new VaultHandle();
    this.vaultDoor.setHandle(this.vaultHandle);
    
    this.glitterEffect = new GlitterEffect();
    this.glitterEffect.alpha = 0;
    
    this.timer = new Timer();
    
    this.resize(window.innerWidth, window.innerHeight);

    // Add all elements in correct order
    this.addChild(this.background, this.vaultDoor, this.vaultHandle, this.glitterEffect, this.timer);

    // Setup handle interaction
    this.vaultHandle.setupInteraction(this.onHandleClick.bind(this));

    this.generateSecretCombination();
  }

  private generateSecretCombination() {
    this.currentStep = 0;
    this.rotationsInCurrentDirection = 0;
    this.secretCombination = [];

    // Reset and start timer
    this.timer.reset();
    this.timer.start();

    // Generate 3 random combinations
    for (let i = 0; i < this.numberOfCombinations; i++) {
      const number = Math.floor(Math.random() * this.numberOfMaxSpinLength) + 1; // 1-9
      const direction = Math.random() < 0.5 ? "clockwise" : "counterclockwise";
      this.secretCombination.push({ number, direction });
    }

    console.log("Secret combination:", this.secretCombination.map(c => 
      `${c.number} ${c.direction}`
    ).join(", "));

    this.logCurrentStep();
  }

  private logCurrentStep() {
    if (this.currentStep < this.secretCombination.length) {
      const current = this.secretCombination[this.currentStep];
      console.log(`Current step ${this.currentStep + 1}: ${current.number} ${current.direction} (${this.rotationsInCurrentDirection} rotations made)`);
    }
  }

  private async onHandleClick(direction: "clockwise" | "counterclockwise") {
    await this.vaultHandle.rotate(direction);
    this.checkCombination(direction);
  }

  private checkCombination(direction: "clockwise" | "counterclockwise") {
    const expectedMove = this.secretCombination[this.currentStep];
    
    if (direction === expectedMove.direction) {
      this.rotationsInCurrentDirection++;
      this.logCurrentStep();

      if (this.rotationsInCurrentDirection === expectedMove.number) {
        this.currentStep++;
        this.rotationsInCurrentDirection = 0;
        
        if (this.currentStep === this.secretCombination.length) {
          this.onSuccess();
        } else {
          this.logCurrentStep();
        }
      }
    } else {
      this.onFailure();
    }
  }

  private async onSuccess() {
    console.log("Success! The vault unlocks!");
    
    // Stop timer and log the time
    this.timer.stop();
    const elapsedTime = this.timer.getElapsedTime();
    const seconds = (elapsedTime / 1000).toFixed(2);
    console.log(`Vault unlocked in ${seconds} seconds!`);
    
    // Open the vault door
    await this.vaultDoor.open();

    // Trigger glitter effect
    this.glitterEffect.alpha = 1;
    await this.glitterEffect.play();

    // After 5 seconds, close the door and reset
    setTimeout(async () => {
      await this.vaultDoor.close();
      await this.vaultHandle.spinCrazy();
      this.generateSecretCombination();
    }, 5000);
  }

  private async onFailure() {
    console.log("Wrong combination! Resetting...");
    await this.vaultHandle.spinCrazy();
    this.generateSecretCombination();
  }

  private resize(width: number, height: number) {
    this.background.width = width;
    this.background.height = height;

    // Size the door to be big enough to cover the vault
    const doorScale = (height * 0.60) / this.vaultDoor.height;

    // Center the door to be in the middle of the vault
    this.vaultDoor.setScale(doorScale);
    this.vaultDoor.setPosition(
      (width - this.vaultDoor.width) / 1.95,
      (height - this.vaultDoor.height) / 2.1
    );

    // Position handle relative to door
    this.vaultHandle.setScale(doorScale);
    this.vaultHandle.setPosition(
      this.vaultDoor.x + this.vaultDoor.width * 0.457,
      this.vaultDoor.y + this.vaultDoor.height * 0.5
    );
    
    this.glitterEffect.setPosition(
      width / 3,
      height / 4.5
    );

    // Position timer on the left side
    this.timer.setPosition(20, 20);
  }

  onResize(width: number, height: number) {
    this.resize(width, height);
  }

  update(delta: number) {
    // This method is required by the PIXI.js ticker
    // We can use it later for continuous animations if needed
  }
}