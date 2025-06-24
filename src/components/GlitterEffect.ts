import { Container, Sprite } from "pixi.js";
import gsap from "gsap";
import { GAME_CONFIG } from "../utils/config";

export class GlitterEffect extends Container {
    private glitterSprites: Sprite[] = [];
    private isPlaying = false;

    constructor() {
        super();
        this.createGlitterSprites();
    }

    private createGlitterSprites() {
        const glitter = Sprite.from("/assets/blink.png");
        glitter.alpha = 0;
        glitter.scale.set(GAME_CONFIG.GLITTER_SCALE);
        
        glitter.x = 0;
        glitter.y = 0;
        
        this.glitterSprites.push(glitter);
        this.addChild(glitter);
    }

    public async play() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        const tl = gsap.timeline();

        const glitter = this.glitterSprites[0];
        
        glitter.scale.set(GAME_CONFIG.GLITTER_SCALE);

        // Fade in
        tl.to(glitter, {
            alpha: 1,
            duration: GAME_CONFIG.GLITTER_FADE_DURATION,
            ease: "power3.in"
        });

        tl.to({}, {duration: GAME_CONFIG.GLITTER_PAUSE_DURATION}); // pause for 0.1 seconds

        // Fade out
        tl.to(glitter, {
            alpha: 0,
            duration: GAME_CONFIG.GLITTER_FADE_DURATION,
            ease: "power3.in"
        });

        // Return promise that resolves when animation is complete
        return new Promise<void>(resolve => {
            tl.call(() => {
                this.isPlaying = false;
                resolve();
            });
        });
    }

    public setPosition(x: number, y: number) {        
        this.x = x;
        this.y = y;
    }
} 