import { BalloonBehavior } from './balloon_behavior.js';

export default class Balloon {
    constructor(config) {
        this.size = config.size || 100;
        this.type = config.type || 'b01';
        this.gameContainer = config.gameContainer;
        this.id = Math.random().toString(36).slice(2, 11);
        this.element = this.createElement();
        this.isPopped = false;
        this.behavior = new BalloonBehavior(this);
        this.velocity = { x: 0, y: 0 };

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
        this.behavior.setPosition(x, y);
    }

    pop() {
        if (this.isPopped) return;
        this.isPopped = true;
    
        this.element.style.backgroundImage = `url('resources/balloon/${this.type}_pop.png')`;
        this.element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            this.element.classList.add('popped');
            this.behavior.playPopSound();
            
            this.element.dispatchEvent(new Event('popped'));
    
            setTimeout(() => {
                if (this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 300);
        }, 50);
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
        this.behavior.applyInertia(dx, dy);
    }

    startFloating() {
        this.behavior.startFloating();
    }

    stopFloating() {
        this.behavior.stopFloating();
    }

    cleanup() {
        this.behavior.cleanup();
        // 他の必要なクリーンアップ処理
    }
}
