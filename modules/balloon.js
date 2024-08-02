export default class Balloon {
    constructor(config) {
        this.initialSize = config.size || 100;
        this.size = this.initialSize;
        this.type = config.type || 'b01';
        this.gameContainer = config.gameContainer;
        this.id = Math.random().toString(36).slice(2, 11);
        this.element = this.createElement();
        this.isBeingTouched = false;
        this.longPressTimer = null;
        this.shrinkInterval = null;
        this.wobbleInterval = null;
        this.isPopped = false;
        this.velocity = { x: 0, y: 0 };
        this.lastPosition = { x: 0, y: 0 };
        this.friction = 0.95; // 摩擦係数

        this.setupEventListeners();
        this.startWobbling();
        this.startShrinking();
    }

    createElement() {
        const balloon = document.createElement('div');
        balloon.className = `balloon ${this.type}`;
        balloon.style.width = `${this.size}px`;
        balloon.style.height = `${this.size}px`;
        balloon.style.backgroundImage = `url('resources/balloon/${this.type}.png')`;
        balloon.style.position = 'absolute';
        balloon.style.transition = 'transform 0.3s ease';
        return balloon;
    }

    setPosition(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    pop() {
        if (this.isPopped) return;
        this.isPopped = true;
    
        this.element.style.backgroundImage = `url('resources/balloon/${this.type}_pop.png')`;
        this.element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            this.element.classList.add('popped');
            this.playPopSound();
            this.stopAllIntervals();
            this.element.dispatchEvent(new Event('popped'));
    
            setTimeout(() => {
                if (this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 300);
        }, 50);
    }

    remove() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.stopAllIntervals();
        this.element.dispatchEvent(new Event('removed'));
    }

    playPopSound() {
        const audio = new Audio(`resources/balloon/${this.type}_pop.mp3`);
        audio.play().catch(error => console.error('Error playing audio:', error));
    }

    setupEventListeners() {
        this.element.addEventListener('mousedown', this.handleTouchStart.bind(this));
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.element.addEventListener('mouseup', this.handleTouchEnd.bind(this));
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.element.addEventListener('mousemove', this.handleMove.bind(this));
        this.element.addEventListener('touchmove', this.handleMove.bind(this));
    }

    handleTouchStart(event) {
        event.preventDefault();
        this.isBeingTouched = true;
        this.checkPop();
        this.deflate();
        this.bounce();
        this.lastPosition = this.getEventPosition(event);
        this.longPressTimer = setTimeout(() => {
            this.continuousInflate();
        }, 300);
    }

    handleTouchEnd() {
        this.isBeingTouched = false;
        clearTimeout(this.longPressTimer);
        clearInterval(this.continuousInflateInterval);
        this.applyInertia();
    }

    handleMove(event) {
        if (!this.isBeingTouched) return;
        
        const currentPosition = this.getEventPosition(event);
        
        this.velocity.x = currentPosition.x - this.lastPosition.x;
        this.velocity.y = currentPosition.y - this.lastPosition.y;
        
        this.lastPosition = currentPosition;
    }

    getEventPosition(event) {
        const touch = event.touches ? event.touches[0] : event;
        return {
            x: touch.clientX,
            y: touch.clientY
        };
    }

    deflate() {
        this.size = Math.max(this.initialSize / 8, this.size - 20);
        this.updateSize();
        if (this.size <= this.initialSize / 8) {
            this.remove();
        }
    }

    inflate() {
        this.size = Math.min(this.initialSize * 2, this.size + 20);
        this.updateSize();
        if (this.size >= this.initialSize * 2) {
            this.pop();
        }
    }

    continuousInflate() {
        this.continuousInflateInterval = setInterval(() => {
            this.inflate();
        }, 300);
    }

    bounce() {
        const directions = [
            {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},
            {x: -1, y: 0}, {x: 1, y: 0},
            {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}
        ];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const currentLeft = parseInt(this.element.style.left);
        const currentTop = parseInt(this.element.style.top);
        
        this.setPosition(currentLeft + direction.x * 10, currentTop + direction.y * 10);
    }

    startShrinking() {
        this.shrinkInterval = setInterval(() => {
            if (!this.isBeingTouched && this.size > this.initialSize) {
                this.size -= 5;
                this.updateSize();
            }
            if (this.size <= this.initialSize / 8) {
                this.remove();
            }
        }, 100);
    }

    startWobbling() {
        let wobbleAmount = 0;
        this.wobbleInterval = setInterval(() => {
            wobbleAmount = Math.sin(Date.now() / 1000) * 5;
            this.element.style.transform = `scale(${this.size / this.initialSize}) translate(${wobbleAmount}px, ${wobbleAmount}px)`;
        }, 50);
    }

    updateSize() {
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
    }

    checkPop() {
        if (this.size >= this.initialSize * 2) {
            this.pop();
        }
    }

    applyInertia() {
        const inertiaInterval = setInterval(() => {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            
            const currentLeft = parseInt(this.element.style.left);
            const currentTop = parseInt(this.element.style.top);
            
            this.setPosition(
                currentLeft + this.velocity.x,
                currentTop + this.velocity.y
            );
            
            if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
                clearInterval(inertiaInterval);
            }
        }, 16); // 約60FPS
    }

    stopAllIntervals() {
        clearInterval(this.shrinkInterval);
        clearInterval(this.wobbleInterval);
        clearInterval(this.continuousInflateInterval);
    }
}
