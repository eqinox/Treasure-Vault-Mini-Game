import { Container, Sprite } from "pixi.js";
import gsap from "gsap";
import { GAME_CONFIG } from "../utils/config";

export class GlitterEffect extends Container {
    private glitter!: Sprite;

    constructor() {
        super();

        this.glitter = Sprite.from("/assets/blink.png");
        this.glitter.alpha = 0;
        this.glitter.scale.set(GAME_CONFIG.GLITTER_SCALE);
        this.glitter.anchor.set(0.5);
        
        this.addChild(this.glitter);
    }

    public async play() {
        const tl = gsap.timeline();

        this.glitter.scale.set(GAME_CONFIG.GLITTER_SCALE);

        // Fade in
        await tl.to(this.glitter, {
            alpha: 1,
            duration: GAME_CONFIG.GLITTER_FADE_DURATION,
            ease: "power3.in"
        });

        await tl.to({}, {duration: GAME_CONFIG.GLITTER_PAUSE_DURATION}); // pause for 0.1 seconds

        // Fade out
        await tl.to(this.glitter, {
            alpha: 0,
            duration: GAME_CONFIG.GLITTER_FADE_DURATION,
            ease: "power3.in"
        });
    }

    public setPosition(x: number, y: number) {        
        this.x = x;
        this.y = y;
    }
} 