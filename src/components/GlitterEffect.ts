import { Container, Sprite } from "pixi.js";
import gsap from "gsap";

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
        glitter.scale.set(0.8);
        
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
        
        glitter.scale.set(0.8);

        // Fade in
        tl.to(glitter, {
            alpha: 1,
            duration: 2,
            ease: "power3.in"
        });

        tl.to({}, {duration: 0.1}); // pause for 0.1 seconds

        // Fade out
        tl.to(glitter, {
            alpha: 0,
            duration: 2,
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