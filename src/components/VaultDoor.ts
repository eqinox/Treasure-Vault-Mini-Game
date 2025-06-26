import { Container, Sprite } from "pixi.js";
import gsap from "gsap";
import { VaultHandle } from "./VaultHandle";
import { GlitterEffect } from "./GlitterEffect";
import { GAME_CONFIG, Direction } from "../utils/config";
import { wait } from "../utils/wait";

export class VaultDoor extends Container {
    private door: Sprite;
    private openDoor: Sprite;
    private openShadow: Sprite;
    private isOpen = false;
    private handle: VaultHandle;
    private originalDoorScale: number = 1; // Store the original door scale
    private glitterEffect: GlitterEffect;

    constructor() {
        super();

        this.door = Sprite.from("/assets/door.png");
        this.openDoor = Sprite.from("/assets/doorOpen.png");
        this.openShadow = Sprite.from("/assets/doorOpenShadow.png");
        this.handle = new VaultHandle();
        this.glitterEffect = new GlitterEffect();

        this.door.anchor.set(0.5);
        this.openDoor.anchor.set(0.5);
        this.openShadow.anchor.set(0.5);

        this.openDoor.alpha = 0;
        this.openDoor.scale.set(0);
        this.openShadow.scale.set(0);
        this.openShadow.alpha = 0;

        this.addChild(this.door, this.openShadow, this.openDoor, this.handle, this.glitterEffect);
    }

    public setScale(scale: number) {
        this.originalDoorScale = scale; // Store the original scale
        this.door.scale.set(scale);
        this.openDoor.scale.set(scale);
        this.openShadow.scale.set(scale);
        this.handle.setScale(scale);
    }

    public get doorWidth(): number {
        return this.door.width;
    }

    public get doorHeight(): number {
        return this.door.height;
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.openDoor.x = this.door.x + (this.door.width / 5);
        this.openShadow.x = this.door.x + (this.door.width / 5);
    }

    public setupHandleInteraction(onClick: (direction: Direction) => void) {
        this.handle.setupInteraction(onClick);
    }

    public async rotateHandle(direction: Direction) {
        return this.handle.rotate(direction);
    }

    public async spinHandleCrazy() {
        return this.handle.spinCrazy();
    }

    public async playGlitterEffect() {
        return this.glitterEffect.play();
    }

    public async fadeOutDoor() {
        gsap.to(this.door.scale, {
            x: 0,
            duration: GAME_CONFIG.DOOR_ANIMATION_DURATION,
            ease: "power2.inOut"
        });

        gsap.to(this.door, {
            alpha: 0,
            duration: GAME_CONFIG.DOOR_ANIMATION_DURATION,
            ease: "power2.inOut"
        });
    }

    public async fadeInOpenDoor() {
        gsap.to([this.openDoor.scale, this.openShadow.scale], {
            x: this.originalDoorScale,
            duration: GAME_CONFIG.DOOR_ANIMATION_DURATION,
            ease: "power2.inOut"
        });

        gsap.to([this.openDoor, this.openShadow], {
            alpha: 1,
            duration: GAME_CONFIG.DOOR_ANIMATION_DURATION,
            ease: "power2.inOut"
        });
    }

    public async open() {
        if (this.isOpen) return;
        this.isOpen = true;

        // Hide handle first
        await gsap.to(this.handle, {
            alpha: 0,
            duration: GAME_CONFIG.HANDLE_FADE_DURATION,
            ease: "power2.inOut"
        });

        this.fadeOutDoor();
        this.fadeInOpenDoor();
        await wait(1);
        await this.playGlitterEffect();
    }

    public async close() {
        if (!this.isOpen) return;
        this.isOpen = false;

        gsap.to([this.openDoor, this.openShadow], {
            alpha: 0,
            duration: GAME_CONFIG.DOOR_ANIMATION_DURATION,
            ease: "power2.inOut"
        })
        
        gsap.to(this.door, {
            alpha: 1,
            duration: GAME_CONFIG.DOOR_ANIMATION_DURATION,
            ease: "power2.inOut"
        })

        await gsap.to(this.door.scale, {
            x: this.originalDoorScale,
            duration: GAME_CONFIG.DOOR_ANIMATION_DURATION,
            ease: "power2.inOut"
        })


        await gsap.to(this.handle, {
            alpha: 1,
            duration: GAME_CONFIG.HANDLE_FADE_DURATION,
            ease: "power2.inOut"
        });
    }
} 