import { Container, Sprite, FederatedPointerEvent, Text } from "pixi.js";
import { SceneUtils } from "../core/App";
import gsap from "gsap";

interface Combination {
  number: number;
  direction: "clockwise" | "counterclockwise";
}

export default class Game extends Container {
  name = "Treasure Vault";
  private background!: Sprite;
  private door!: Sprite;
  private handle!: Sprite;
  private handleShadow!: Sprite;
  private statusText!: Text;
  
  // Game state
  private isRotating = false;
  private secretCombination: Combination[] = [];
  private currentStep = 0;
  private rotationsInCurrentDirection = 0;

  constructor(protected utils: SceneUtils) {
    super();
  }

  async load() {
    await this.utils.assetLoader.loadAssets();
  }

  async start() {
    this.removeChildren();

    this.background = Sprite.from("/assets/bg.png");
    this.door = Sprite.from("/assets/door.png");
    this.handleShadow = Sprite.from("/assets/handleShadow.png");
    this.handle = Sprite.from("/assets/handle.png");
    
    this.handle.anchor.set(0.5);
    this.handleShadow.anchor.set(0.5);

    this.statusText = new Text("", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
      align: "center"
    });
    this.statusText.anchor.set(0.5);
    
    this.resize(window.innerWidth, window.innerHeight);

    this.addChild(this.background, this.door, this.handleShadow, this.handle, this.statusText);

    this.handle.eventMode = 'static';
    this.handle.cursor = 'pointer';
    this.handle.on('pointerdown', this.onHandleClick.bind(this));

    this.generateSecretCombination();
  }

  private generateSecretCombination() {
    this.currentStep = 0;
    this.rotationsInCurrentDirection = 0;
    this.secretCombination = [];
    this.statusText.text = "";

    // Generate 3 random combinations
    for (let i = 0; i < 3; i++) {
      const number = Math.floor(Math.random() * 9) + 1; // 1-9
      const direction = Math.random() < 0.5 ? "clockwise" : "counterclockwise";
      this.secretCombination.push({ number, direction });
    }

    // Log the combination to console
    console.log("Secret combination:", this.secretCombination.map(c => 
      `${c.number} ${c.direction}`
    ).join(", "));

    // Log current step to console
    this.logCurrentStep();
  }

  private logCurrentStep() {
    if (this.currentStep < this.secretCombination.length) {
      const current = this.secretCombination[this.currentStep];
      console.log(`Current step ${this.currentStep + 1}: ${current.number} ${current.direction} (${this.rotationsInCurrentDirection} rotations made)`);
    }
  }

  private onHandleClick(event: FederatedPointerEvent) {
    if (this.isRotating) return;

    const clickX = event.global.x;
    const handleCenterX = this.handle.getGlobalPosition().x;
    const direction = clickX < handleCenterX ? "counterclockwise" : "clockwise";
    
    this.rotateHandle(direction);
  }

  private rotateHandle(direction: "clockwise" | "counterclockwise") {
    this.isRotating = true;

    const rotationAmount = direction === "clockwise" ? Math.PI / 3 : -Math.PI / 3;
    const currentRotation = this.handle.rotation;
    const targetRotation = currentRotation + rotationAmount;

    // Create a timeline for synchronized animations
    const tl = gsap.timeline({
      onComplete: () => {
        this.isRotating = false;
        this.statusText.text = "";
        this.checkCombination(direction);
      }
    });

    // Animate handle with a quick ease-out
    tl.to(this.handle, {
      rotation: targetRotation,
      duration: 0.5,
      ease: "power2.out"
    });

    // Animate shadow with a slight delay and slower movement
    tl.to(this.handleShadow, {
      rotation: targetRotation,
      duration: 0.51, // Slightly longer duration
      ease: "power1.out", // Different easing for shadow
    }, "-=0.50"); // Start slightly after handle starts moving
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

  private onSuccess() {
    console.log("Success! The vault unlocks!");

    // TODO: Add the animation for the vault opening
  }

  private onFailure() {
    this.statusText.text = "❌ Wrong move! Resetting... ❌";
    console.log("Wrong combination! Resetting...");
    
    this.isRotating = true;

    // Create a timeline for the crazy spin
    const tl = gsap.timeline({
      onComplete: () => {
        this.isRotating = false;
        this.statusText.text = "";
        this.generateSecretCombination();
      }
    });

    // Spin handle rapidly
    tl.to(this.handle, {
      rotation: this.handle.rotation + Math.PI * 4,
      duration: 1,
      ease: "power2.inOut"
    });

    // Shadow follows with more exaggerated delay
    tl.to(this.handleShadow, {
      rotation: this.handle.rotation + Math.PI * 4,
      duration: 1.1,
      ease: "power1.inOut"
    }, "-=0.99");
  }

  update(_delta: number) {
    // Will add additional game logic here later
  }

  private resize(width: number, height: number) {
    this.background.width = width;
    this.background.height = height;

    const doorScale = (height * 0.60) / this.door.height;
    this.door.scale.set(doorScale);

    this.door.x = (width - this.door.width) / 1.95;
    this.door.y = (height - this.door.height) / 2.1;

    this.handle.scale.set(doorScale);
    this.handleShadow.scale.set(doorScale);

    const handleOffsetX = this.door.width * 0.46;
    const handleOffsetY = this.door.height * 0.5;

    this.handle.x = this.door.x + handleOffsetX;
    this.handle.y = this.door.y + handleOffsetY;
    
    this.handleShadow.x = this.handle.x;
    this.handleShadow.y = this.handle.y;

    this.statusText.x = width / 2;
    this.statusText.y = 50;
  }

  onResize(width: number, height: number) {
    this.resize(width, height);
  }
}