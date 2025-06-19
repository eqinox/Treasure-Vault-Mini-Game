import { Container, Sprite } from "pixi.js";
import gsap from "gsap";
import { VaultHandle } from "./VaultHandle";

export class VaultDoor extends Container {
    private door: Sprite;
    private openDoor: Sprite;
    private openShadow: Sprite;
    private isOpen = false;
    private closedX: number = 0;
    private handle: VaultHandle | null = null;

    constructor() {
        super();

        this.door = Sprite.from("/assets/door.png");
        this.openDoor = Sprite.from("/assets/doorOpen.png");
        this.openShadow = Sprite.from("/assets/doorOpenShadow.png");

        this.openDoor.alpha = 0;
        this.openShadow.alpha = 0;

        this.addChild(this.door, this.openShadow, this.openDoor);
    }

    public setHandle(handle: VaultHandle) {
        this.handle = handle;
    }

    public setScale(scale: number) {
        this.door.scale.set(scale);
        this.openDoor.scale.set(scale);
        this.openShadow.scale.set(scale);
    }

    public setPosition(x: number, y: number) {
        this.closedX = x;
        this.x = x;
        this.y = y;
    }

    public async open() {
        if (this.isOpen) return;
        this.isOpen = true;

        // Create timeline for door opening animation
        const tl = gsap.timeline();

        // Calculate open position
        const openX = (window.innerWidth - this.openDoor.width * this.openDoor.scale.x) / 2;

        // Hide handle first
        if (this.handle) {
            tl.to(this.handle, {
                alpha: 0,
                duration: 0.3,
                ease: "power2.inOut"
            });
        }

        // Simultaneously move door and fade in open state
        tl.to(this, {
            x: openX,
            duration: 0.5,
            ease: "power2.inOut"
        });

        // Fade in open door and shadow while fading out closed door
        tl.to([this.openDoor, this.openShadow], {
            alpha: 1,
            duration: 0.5,
            ease: "power2.inOut"
        }, "-=0.5");

        tl.to(this.door, {
            alpha: 0,
            duration: 0.5,
            ease: "power2.inOut"
        }, "-=0.5");

        // Return promise that resolves when animation is complete
        return new Promise<void>(resolve => {
            tl.call(() => resolve());
        });
    }

    public async close() {
        if (!this.isOpen) return;
        this.isOpen = false;

        const tl = gsap.timeline();

        // Move back to closed position while fading
        tl.to(this, {
            x: this.closedX,
            duration: 0.5,
            ease: "power2.inOut"
        });

        // Fade out open door and shadow while fading in closed door
        tl.to([this.openDoor, this.openShadow], {
            alpha: 0,
            duration: 0.5,
            ease: "power2.inOut"
        }, "-=0.5");

        tl.to(this.door, {
            alpha: 1,
            duration: 0.5,
            ease: "power2.inOut"
        }, "-=0.5");

        // Show handle after door is closed
        if (this.handle) {
            tl.to(this.handle, {
                alpha: 1,
                duration: 0.3,
                ease: "power2.inOut"
            });
        }

        return new Promise<void>(resolve => {
            tl.call(() => resolve());
        });
    }
} 