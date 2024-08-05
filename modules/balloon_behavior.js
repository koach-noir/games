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

            const currentLeft = parseFloat(this.balloon.element.style.left) || 0;
            const currentTop = parseFloat(this.balloon.element.style.top) || 0;

            this.setPosition(currentLeft + offsetX, currentTop + offsetY);
        }, 50);
    }

    stopFloating() {
        if (this.floatInterval) {
            clearInterval(this.floatInterval);
            this.floatInterval = null;
        }
    }

    setPosition(x, y) {
        const containerRect = this.balloon.gameContainer.getBoundingClientRect();
        const maxX = containerRect.width - this.balloon.size;
        const maxY = containerRect.height - this.balloon.size;

        // 風船が壁に触れたら反発する
        if (x < 0 || x > maxX) {
            this.balloon.velocity.x *= -1;
            x = x < 0 ? 0 : maxX;
        }
        if (y < 0 || y > maxY) {
            this.balloon.velocity.y *= -1;
            y = y < 0 ? 0 : maxY;
        }

        this.balloon.element.style.left = `${x}px`;
        this.balloon.element.style.top = `${y}px`;
    }

    applyInertia(dx, dy) {
        const friction = 0.95;
        let vx = dx;
        let vy = dy;

        const move = () => {
            vx *= friction;
            vy *= friction;

            const currentLeft = parseInt(this.balloon.element.style.left);
            const currentTop = parseInt(this.balloon.element.style.top);

            this.setPosition(currentLeft + vx, currentTop + vy);

            if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
                requestAnimationFrame(move);
            }
        };

        requestAnimationFrame(move);
    }

    playPopSound() {
        const audio = new Audio(`resources/balloon/${this.balloon.type}_pop.mp3`);
        audio.play().catch(error => console.error('Error playing audio:', error));
    }

    cleanup() {
        this.stopFloating();
    }
}
