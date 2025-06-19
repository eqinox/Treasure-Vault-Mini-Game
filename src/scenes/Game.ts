import { Container, Sprite } from "pixi.js";
import { SceneUtils } from "../core/App";

export default class Game extends Container {
  name = "Game";
  private background!: Sprite;
  private door!: Sprite;

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
    
    this.resize(window.innerWidth, window.innerHeight);

    this.addChild(this.background, this.door);
  }

  update(_delta: number) {
    // Will add game logic here later
  }

  private resize(width: number, height: number) {
    this.background.width = width;
    this.background.height = height;

    // Size the door to be big enough to cover the vault
    const doorScale = (height * 0.60) / this.door.height;
    this.door.scale.set(doorScale);

    // Center the door to be in the middle of the vault
    this.door.x = (width - this.door.width) / 1.95;
    this.door.y = (height - this.door.height) / 2.1;
  }

  onResize(width: number, height: number) {
    this.resize(width, height);
  }
}