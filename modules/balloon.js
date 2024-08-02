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
        this.dragStartTime = 0;
        this.startX = 0;
        this.startY = 0;
        this.lastTapTime = 0;

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

    setupEventListeners() {
        this.element.addEventListener('mousedown', this.handleTouchStart.bind(this));
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('mousemove', this.handleTouchMove.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('mouseup', this.handleTouchEnd.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(event) {
        if (this.isPopped) return;
        event.preventDefault();
        this.isBeingTouched = true;
        this.dragStartTime = Date.now();

        if (event.type === 'mousedown') {
            this.startX = event.clientX - this.element.offsetLeft;
            this.startY = event.clientY - this.element.offsetTop;
        } else if (event.type === 'touchstart') {
            this.startX = event.touches[0].clientX - this.element.offsetLeft;
            this.startY = event.touches[0].clientY - this.element.offsetTop;
        }

        this.longPressTimer = setTimeout(() => {
            this.isDragging = true;
            this.element.style.cursor = 'move';
        }, 500); // 500ミリ秒の長押しでドラッグモードに入る

        // ダブルタップ検出
        const currentTime = Date.now();
        if (currentTime - this.lastTapTime < 300) { // 300ミリ秒以内の2回のタップ
            this.inflate();
        }
        this.lastTapTime = currentTime;
    }

    handleTouchMove(event) {
        if (!this.isBeingTouched) return;
        event.preventDefault();

        let clientX, clientY;
        if (event.type === 'mousemove') {
            clientX = event.clientX;
            clientY = event.clientY;
        } else if (event.type === 'touchmove') {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        }

        if (this.isDragging) {
            const newX = clientX - this.startX;
            const newY = clientY - this.startY;
            this.setPosition(newX, newY);
        } else {
            // タップしてすぐの移動は無視（小さな動きは許容）
            const moveX = Math.abs(clientX - (this.startX + this.element.offsetLeft));
            const moveY = Math.abs(clientY - (this.startY + this.element.offsetTop));
            if (moveX > 10 || moveY > 10) {
                clearTimeout(this.longPressTimer);
            }
        }
    }

    handleTouchEnd() {
        this.isBeingTouched = false;
        this.isDragging = false;
        this.element.style.cursor = 'pointer';
        clearTimeout(this.longPressTimer);

        // タップ時の挙動（短い接触時間の場合）
        if (Date.now() - this.dragStartTime < 200) {
            this.inflate();
            this.bounce();
        }
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
