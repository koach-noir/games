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
    
        // 画像を変更
        this.element.style.backgroundImage = `url('resources/balloon/${this.type}_pop.png')`;
        
        // アニメーションのための準備
        this.element.style.transition = 'all 0.3s ease';
        
        // 少し遅延させてからアニメーションを開始
        setTimeout(() => {
            this.element.classList.add('popped');
            
            // 音を再生
            this.playPopSound();
            
            // すべてのインターバルを停止
            this.stopAllIntervals();
            
            // ポップイベントをディスパッチ
            this.element.dispatchEvent(new Event('popped'));
    
            // アニメーション完了後に要素を削除
            setTimeout(() => {
                if (this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 300); // CSSのtransitionと同じ時間（0.3秒）
        }, 50); // 50ミリ秒の遅延を追加
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
    }

    handleTouchStart(event) {
        event.preventDefault();
        this.isBeingTouched = true;
        this.checkPop();
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
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
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

    stopAllIntervals() {
        clearInterval(this.shrinkInterval);
        clearInterval(this.wobbleInterval);
        clearInterval(this.continuousInflateInterval);
    }
}
