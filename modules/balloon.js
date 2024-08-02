export default class Balloon {
    constructor(config) {
        this.size = config.size || 100;
        this.type = config.type || 'b01';
        this.gameContainer = config.gameContainer;
        this.id = Math.random().toString(36).slice(2, 11);
        this.element = this.createElement();
        this.isPopped = false;

        this.setupEventListeners();
    }

    createElement() {
        const balloon = document.createElement('div');
        balloon.className = `balloon ${this.type}`;
        balloon.style.width = `${this.size}px`;
        balloon.style.height = `${this.size}px`;
        balloon.style.backgroundImage = `url('resources/balloon/${this.type}.png')`;
        balloon.style.position = 'absolute';
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
            
            this.element.dispatchEvent(new Event('popped'));
    
            setTimeout(() => {
                if (this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 300);
        }, 50);
    }

    playPopSound() {
        const audio = new Audio(`resources/balloon/${this.type}_pop.mp3`);
        audio.play().catch(error => console.error('Error playing audio:', error));
    }

    setupEventListeners() {
        this.element.addEventListener('mousedown', this.handleInteraction.bind(this));
        this.element.addEventListener('touchstart', this.handleInteraction.bind(this));
    }

    handleInteraction(event) {
        event.preventDefault();
        this.element.dispatchEvent(new CustomEvent('balloonInteraction', { detail: { balloon: this, event: event } }));
    }

    applyInertia(dx, dy) {
        const friction = 0.95;
        let vx = dx;
        let vy = dy;

        const move = () => {
            vx *= friction;
            vy *= friction;

            const currentLeft = parseInt(this.element.style.left);
            const currentTop = parseInt(this.element.style.top);

            this.setPosition(currentLeft + vx, currentTop + vy);

            if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
                requestAnimationFrame(move);
            }
        };

        requestAnimationFrame(move);
    }
}
