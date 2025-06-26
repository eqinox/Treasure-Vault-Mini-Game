import { Container, Text } from "pixi.js";
import { GAME_CONFIG } from "../utils/config";

export class Timer extends Container {
    private timerText: Text;
    private startTime: number = 0;
    private isRunning: boolean = false;
    private intervalId: number | null = null;

    constructor() {
        super();
        
        this.timerText = new Text("Time: 00:00", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "white",
            align: "left"
        });
        
        this.timerText.anchor.set(0, 0);
        this.addChild(this.timerText);
    }

    public start() {
        this.startTime = Date.now();
        this.isRunning = true;
        this.updateTimer();
        
        this.intervalId = window.setInterval(() => {
            this.updateTimer();
        }, GAME_CONFIG.TIMER_UPDATE_INTERVAL);
    }

    public stop() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    public reset() {
        this.stop();
        this.startTime = 0;
        this.timerText.text = "Time: 00:00";
    }

    private updateTimer() {
        if (!this.isRunning) return;
        
        const elapsed = Date.now() - this.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const milliseconds = Math.floor((elapsed % 1000) / 10);
        
        const timeString = `Time: ${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
        this.timerText.text = timeString;
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getElapsedTime(): number {
        if (!this.isRunning) return 0;
        return Date.now() - this.startTime;
    }
} 