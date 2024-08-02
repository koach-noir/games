export class BalloonBehavior {
    constructor(balloon) {
        this.balloon = balloon;
        this.floatInterval = null;
    }

    startFloating() {
        this.floatInterval = setInterval(() => {
            const amplitude = 5;
            const frequency = 0.05;

            const time = Date.now() * frequency;
            const offsetX = Math.sin(time) * amplitude;
            const offsetY = Math.cos(time * 0.8) * amplitude;

            const currentLeft = parseFloat(this.balloon.element.style.left);
            const currentTop = parseFloat(this.balloon.element.style.top);

            this.balloon.setPosition(currentLeft + offsetX, currentTop + offsetY);
        }, 50);
    }

    stopFloating() {
        if (this.floatInterval) {
            clearInterval(this.floatInterval);
            this.floatInterval = null;
        }
    }

    cleanup() {
        this.stopFloating();
    }
}
