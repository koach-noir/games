export default class Balloon {
    constructor(config) {
        this.size = config.size || 100;
        this.type = config.type || 'b01';
        this.gameContainer = config.gameContainer;
        this.id = Math.random().toString(36).slice(2, 11);
        this.element = this.createElement();
        this.isBeingTouched = false;
        this.longPressTimer = null;
        this.shrinkInterval = null;
        this.wobbleInterval = null;
        this.isPopped = false;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;

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
        balloon.style.cursor = 'move';
        return balloon;
    }

    setPosition(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    setupEventListeners() {
        this.element.addEventListener('mousedown', this.handleDragStart.bind(this));
        this.element.addEventListener('touchstart', this.handleDragStart.bind(this));
        document.addEventListener('mousemove', this.handleDragMove.bind(this));
        document.addEventListener('touchmove', this.handleDragMove.bind(this));
        document.addEventListener('mouseup', this.handleDragEnd.bind(this));
        document.addEventListener('touchend', this.handleDragEnd.bind(this));
    }

    handleDragStart(event) {
        if (this.isPopped) return;
        event.preventDefault();
        this.isDragging = true;
        this.isBeingTouched = true;
        this.element.style.transition = 'none';
        
        if (event.type === 'mousedown') {
            this.startX = event.clientX - this.element.offsetLeft;
            this.startY = event.clientY - this.element.offsetTop;
        } else if (event.type === 'touchstart') {
            this.startX = event.touches[0].clientX - this.element.offsetLeft;
            this.startY = event.touches[0].clientY - this.element.offsetTop;
        }

        this.longPressTimer = setTimeout(() => {
            this.inflate();
        }, 300);
    }

    handleDragMove(event) {
        if (!this.isDragging) return;
        event.preventDefault();
        
        let clientX, clientY;
        if (event.type === 'mousemove') {
            clientX = event.clientX;
            clientY = event.clientY;
        } else if (event.type === 'touchmove') {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        }

        const newX = clientX - this.startX;
        const newY = clientY - this.startY;

        this.setPosition(newX, newY);
    }

    handleDragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.isBeingTouched = false;
        this.element.style.transition = 'transform 0.3s ease';
        clearTimeout(this.longPressTimer);
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
    }

    updateSize() {
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
    }

    startWobbling() {
        let wobbleAmount = 0;
        this.wobbleInterval = setInterval(() => {
            if (!this.isDragging) {
                wobbleAmount = Math.sin(Date.now() / 1000) * 5;
                this.element.style.transform = `translate(${wobbleAmount}px, ${wobbleAmount}px)`;
            }
        }, 50);
    }

    startShrinking() {
        this.shrinkInterval = setInterval(() => {
            if (!this.isBeingTouched && !this.isDragging && this.size > 100) {
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

    pop() {
        if (this.isPopped) return;
        this.isPopped = true;

        this.element.style.backgroundImage = `url('resources/balloon/${this.type}_pop.png')`;
        this.element.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            this.element.classList.add('popped');
            this.playPopSound();
            this.stopAllIntervals();
            this.element.dispatchEvent(new Event('popped'));

            setTimeout(() => {
                if (this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 800);
        }, 100);
    }

    playPopSound() {
        const audio = new Audio(`resources/balloon/${this.type}_pop.mp3`);
        audio.play().catch(error => console.error('Error playing audio:', error));
    }

    stopAllIntervals() {
        clearInterval(this.shrinkInterval);
        clearInterval(this.wobbleInterval);
    }
}
