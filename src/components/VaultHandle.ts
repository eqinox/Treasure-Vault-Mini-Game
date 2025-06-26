import { Container, Sprite, FederatedPointerEvent } from "pixi.js";
import gsap from "gsap";
import { GAME_CONFIG, Direction } from "../utils/config";

export class VaultHandle extends Container {
    private handle: Sprite;
    private handleShadow: Sprite;

    constructor() {
        super();
        
        this.handleShadow = Sprite.from("/assets/handleShadow.png");
        this.handle = Sprite.from("/assets/handle.png");
        
        this.handle.anchor.set(0.5);
        this.handleShadow.anchor.set(0.5);

        this.handle.x = -23;
        this.handleShadow.x = -23;

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
            const clickX = event.global.x;
            const handleCenterX = this.handle.getGlobalPosition().x;
            const direction = clickX < handleCenterX ? Direction.COUNTERCLOCKWISE : Direction.CLOCKWISE;
            
            onClick(direction);
        });
    }

    public async rotate(direction: Direction) {
        const rotationAmount = direction === Direction.CLOCKWISE ? GAME_CONFIG.HANDLE_ROTATION_AMOUNT : -GAME_CONFIG.HANDLE_ROTATION_AMOUNT;
        const currentRotation = this.handle.rotation;
        const targetRotation = currentRotation + rotationAmount;

        // Animate handle with a quick ease-out
        gsap.to(this.handle, {
            rotation: targetRotation,
            duration: GAME_CONFIG.HANDLE_ROTATION_DURATION,
            ease: "power2.out"
        });

        // Animate shadow with a slight delay and slower movement
        await gsap.to(this.handleShadow, {
            alpha: 0.5,
            rotation: targetRotation,
            duration: GAME_CONFIG.HANDLE_ROTATION_DURATION,
            ease: "power1.out",
        });
    }

    public async spinCrazy() {
        // Spin handle like crazy
        gsap.to(this.handle, {
            rotation: this.handle.rotation + Math.PI * GAME_CONFIG.HANDLE_SPIN_ROTATIONS,
            duration: GAME_CONFIG.HANDLE_SPIN_DURATION,
            ease: "power2.inOut"
        });

        // Shadow follows with more exaggerated delay
        await gsap.to(this.handleShadow, {
            alpha: 0.3,
            rotation: this.handle.rotation + Math.PI * GAME_CONFIG.HANDLE_SPIN_ROTATIONS,
            duration: GAME_CONFIG.HANDLE_SPIN_DURATION,
            ease: "power1.inOut"
        });
    }
} 