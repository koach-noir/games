export default class Balloon {
    constructor({ type, gameContainer }) {
        console.log(`[Balloon] Creating new balloon of type: ${type}`);
        this.type = type;
        this.gameContainer = gameContainer;
        this.id = Math.random().toString(36).substr(2, 9);
        this.size = 100;
        this.element = this.createElement();
        this.isBeingTouched = false;
        this.longPressTimer = null;
        this.shrinkInterval = null;
        this.wobbleInterval = null;

        this.setupEventListeners();
        this.startWobbling();
        this.startShrinking();
    }

    createElement() {
        const element = document.createElement('div');
        element.className = `balloon ${this.type}`;
        element.style.position = 'absolute';
        element.style.transition = 'transform 0.3s ease';
        return element;
    }

    setPosition(left, top) {
        console.log(`[Balloon] Setting position to (${left}, ${top})`);
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
    }

    setupEventListeners() {
        this.element.addEventListener('mousedown', this.handleTouchStart.bind(this));
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.element.addEventListener('mouseup', this.handleTouchEnd.bind(this));
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(event) {
        event.preventDefault();
        this.isBeingTouched = true;
        this.inflate();
        this.bounce();
        this.longPressTimer = setTimeout(() => {
            this.continuousInflate();
        }, 300);
    }

    handleTouchEnd() {
        this.isBeingTouched = false;
        clearTimeout(this.longPressTimer);
        clearInterval(this.continuousInflateInterval);
    }

    inflate() {
        if (this.size < 100) {
            this.size += 20;
        } else if (this.size < 180) {
            this.size += 30;
        } else {
            this.size += 20;
        }
        this.updateSize();
        this.checkPop();
    }

    continuousInflate() {
        this.continuousInflateInterval = setInterval(() => {
            if (this.size < 100) {
                this.size += 10;
            } else if (this.size < 180) {
                this.size += 20;
            } else {
                this.size += 10;
            }
            this.updateSize();
            this.checkPop();
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
        
        this.element.style.left = `${currentLeft + direction.x * 10}px`;
        this.element.style.top = `${currentTop + direction.y * 10}px`;
    }

    startShrinking() {
        this.shrinkInterval = setInterval(() => {
            if (!this.isBeingTouched && this.size > 100) {
                if (this.size > 180) {
                    this.size -= 10;
                } else {
                    this.size -= 5;
                }
                this.updateSize();
            }
            if (this.size <= 10) {
                this.pop();
            }
        }, 100);
    }

    startWobbling() {
        let wobbleAmount = 0;
        this.wobbleInterval = setInterval(() => {
            wobbleAmount = Math.sin(Date.now() / 1000) * 5;
            this.element.style.transform = `scale(${this.size / 100}) translate(${wobbleAmount}px, ${wobbleAmount}px)`;
        }, 50);
    }

    updateSize() {
        this.element.style.transform = `scale(${this.size / 100})`;
    }

    checkPop() {
        if (this.size >= 200) {
            setTimeout(() => {
                if (this.size >= 200) {
                    this.pop();
                }
            }, 1000);
        }
    }

    pop() {
        clearInterval(this.shrinkInterval);
        clearInterval(this.wobbleInterval);
        this.element.classList.add('popped');
        setTimeout(() => {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 300);
    }
}
