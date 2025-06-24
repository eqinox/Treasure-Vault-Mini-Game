import { Container, Sprite, FederatedPointerEvent } from "pixi.js";
import gsap from "gsap";
import { GAME_CONFIG, Direction } from "../utils/config";

export class VaultHandle extends Container {
    private handle: Sprite;
    private handleShadow: Sprite;
    private isRotating = false;

    constructor() {
        super();
        
        this.handleShadow = Sprite.from("/assets/handleShadow.png");
        this.handle = Sprite.from("/assets/handle.png");
        
        // Set anchor points to center for rotation
        this.handle.anchor.set(0.5);
        this.handleShadow.anchor.set(0.5);

        this.addChild(this.handleShadow, this.handle);

        this.handle.eventMode = 'static';
        this.handle.cursor = 'pointer';
    }

    public setScale(scale: number) {
        this.handle.scale.set(scale);
        this.handleShadow.scale.set(scale);
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public setupInteraction(onClick: (direction: Direction) => void) {
        this.handle.on('pointerdown', (event: FederatedPointerEvent) => {
            if (this.isRotating) return;

            const clickX = event.global.x;
            const handleCenterX = this.handle.getGlobalPosition().x;
            const direction = clickX < handleCenterX ? "counterclockwise" : "clockwise";
            
            onClick(direction);
        });
    }

    public async rotate(direction: Direction) {
        if (this.isRotating) return;
        this.isRotating = true;

        const rotationAmount = direction === "clockwise" ? GAME_CONFIG.HANDLE_ROTATION_AMOUNT : -GAME_CONFIG.HANDLE_ROTATION_AMOUNT;
        const currentRotation = this.handle.rotation;
        const targetRotation = currentRotation + rotationAmount;

        // Create a timeline for synchronized animations
        const tl = gsap.timeline({
            onComplete: () => {
                this.isRotating = false;
            }
        });

        // Animate handle with a quick ease-out
        tl.to(this.handle, {
            rotation: targetRotation,
            duration: GAME_CONFIG.HANDLE_ROTATION_DURATION,
            ease: "power2.out"
        });

        // Animate shadow with a slight delay and slower movement
        tl.to(this.handleShadow, {
            alpha: GAME_CONFIG.SHADOW_ALPHA,
            rotation: targetRotation,
            duration: GAME_CONFIG.HANDLE_ROTATION_DURATION,
            ease: "power1.out",
        }, "-=0.50");

        return new Promise<void>(resolve => {
            tl.call(() => resolve());
        });
    }

    public async spinCrazy() {
        if (this.isRotating) return;
        this.isRotating = true;

        const tl = gsap.timeline({
            onComplete: () => {
                this.isRotating = false;
            }
        });

        // Spin handle like crazy
        tl.to(this.handle, {
            rotation: this.handle.rotation + Math.PI * GAME_CONFIG.HANDLE_SPIN_ROTATIONS,
            duration: GAME_CONFIG.HANDLE_SPIN_DURATION,
            ease: "power2.inOut"
        });

        // Shadow follows with more exaggerated delay
        tl.to(this.handleShadow, {
            alpha: 0.3,
            rotation: this.handle.rotation + Math.PI * GAME_CONFIG.HANDLE_SPIN_ROTATIONS,
            duration: GAME_CONFIG.HANDLE_SPIN_DURATION,
            ease: "power1.inOut"
        }, "-=0.99");

        return new Promise<void>(resolve => {
            tl.call(() => resolve());
        });
    }
} 