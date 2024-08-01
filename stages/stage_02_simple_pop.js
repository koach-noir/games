import Balloon from '../modules/balloon.js';

export default class Stage02SimplePop {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.gameContainer = gameManager.getGameContainer();
        this.balloonCount = 3;
        this.balloons = [];
        this.clearCondition = 7;
        this.tapCount = {};
        this.initialSizes = {};
        this.eventListeners = [];
    }

    start() {
        this.cleanup();
        this.createBalloons();
        this.gameManager.showStageNotification("Stage 2: Pop 3 balloons! Tap to inflate, pop when they're too big!");
    }

    createBalloons() {
        for (let i = 0; i < this.balloonCount; i++) {
            this.createBalloon();
        }
    }

    createBalloon() {
        const balloon = new Balloon({
            type: this.getRandomBalloonType(),
            size: 100
        });
        
        const left = Math.random() * (this.gameContainer.clientWidth - balloon.size);
        const top = Math.random() * (this.gameContainer.clientHeight - balloon.size);
        balloon.setPosition(left, top);

        // 初期サイズをランダムに設定 (50%~100%)
        const initialScale = 0.5 + Math.random() * 0.5;
        this.initialSizes[balloon.id] = initialScale;
        balloon.element.style.transform = `scale(${initialScale})`;

        const clickHandler = () => this.tapBalloon(balloon);
        balloon.element.addEventListener('click', clickHandler);
        this.eventListeners.push({ element: balloon.element, type: 'click', handler: clickHandler });
        
        this.gameContainer.appendChild(balloon.element);
        this.balloons.push(balloon);
        this.tapCount[balloon.id] = 0;
    }

    tapBalloon(balloon) {
        this.tapCount[balloon.id]++;
        const currentScale = this.initialSizes[balloon.id] * (1 + this.tapCount[balloon.id] * 0.3);
        
        if (currentScale > this.initialSizes[balloon.id] * 2) {
            this.popBalloon(balloon);
        } else {
            balloon.element.style.transform = `scale(${currentScale})`;
        }
    }

    popBalloon(balloon) {
        balloon.pop();
        this.gameManager.incrementScore();
        
        setTimeout(() => {
            this.removeBalloon(balloon);
            this.createBalloon();
        }, 300);
    }

    removeBalloon(balloon) {
        if (this.gameContainer.contains(balloon.element)) {
            this.gameContainer.removeChild(balloon.element);
        }
        this.balloons = this.balloons.filter(b => b !== balloon);
        delete this.tapCount[balloon.id];
        delete this.initialSizes[balloon.id];
        const listenerIndex = this.eventListeners.findIndex(
            listener => listener.element === balloon.element
        );
        if (listenerIndex !== -1) {
            const { element, type, handler } = this.eventListeners[listenerIndex];
            element.removeEventListener(type, handler);
            this.eventListeners.splice(listenerIndex, 1);
        }
    }

    getRandomBalloonType() {
        const types = ['b01', 'b02', 'b03', 'b04', 'b05'];
        return types[Math.floor(Math.random() * types.length)];
    }

    cleanup() {
        this.balloons.forEach(balloon => this.removeBalloon(balloon));
        this.balloons = [];
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = [];
        this.tapCount = {};
        this.initialSizes = {};
        while (this.gameContainer.firstChild) {
            this.gameContainer.removeChild(this.gameContainer.firstChild);
        }
    }

    checkClearCondition(score) {
        return score >= this.clearCondition;
    }
}
