import { Container, Sprite } from "pixi.js";
import gsap from "gsap";
import { wait } from "../utils/index";
import { GAME_CONFIG } from "../utils/config";

export class GlitterEffect extends Container {
    private glitter!: Sprite;

    constructor() {
        super();

        this.glitter = Sprite.from("/assets/blink.png");
        this.glitter.alpha = 0;
        this.glitter.anchor.set(0.5, 0.5);
        this.x = -100;
        this.y = -30;

        this.addChild(this.glitter);
    }

    public async play() {
        // Start small and fade in
        this.glitter.scale.set(0.3);
        this.glitter.alpha = 0.1;
        
        // Grow to full size
        gsap.to(this.glitter.scale, {
            x: 1,
            y: 1,
            duration: GAME_CONFIG.GLITTER_DURATION,
            ease: "power2.out"
        });

        await gsap.to(this.glitter, {
            alpha: 1,
            duration: GAME_CONFIG.GLITTER_DURATION,
            ease: "power2.out"
        });

        await wait(GAME_CONFIG.GLITTER_PAUSE_DURATION);

        // Shrink back to 0 and fade out
        gsap.to(this.glitter.scale, {
            x: 0,
            y: 0,
            duration: GAME_CONFIG.GLITTER_DURATION,
            ease: "power2.in"
        });

        await gsap.to(this.glitter, {
            alpha: 0,
            duration: GAME_CONFIG.GLITTER_DURATION,
            ease: "power2.in"
        });

        // Reset for next use
        this.glitter.scale.set(0);
        this.glitter.alpha = 0;
    }
} 