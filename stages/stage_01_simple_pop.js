import Balloon from '../modules/balloon.js';

export default class Stage01SimplePop {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.gameContainer = gameManager.getGameContainer();
        this.balloonCount = 7;
        this.balloons = [];
        this.clearCondition = 10;
        this.eventListeners = [];
    }

    start() {
        this.cleanup();
        this.createBalloons();
        this.gameManager.showStageNotification("Stage 1: Pop 10 balloons!");
    }

    createBalloons() {
        for (let i = 0; i < this.balloonCount; i++) {
            this.createBalloon();
        }
    }

    createBalloon() {
        console.log('[Stage] Starting to create a new balloon');
        const balloon = new Balloon({
            type: this.getRandomBalloonType(),
            gameContainer: this.gameContainer
        });
        
        const left = Math.random() * (this.gameContainer.clientWidth - 100);
        const top = Math.random() * (this.gameContainer.clientHeight - 100);
        balloon.setPosition(left, top);

        const popHandler = () => this.onBalloonPopped(balloon);
        balloon.element.addEventListener('popped', popHandler);
        this.eventListeners.push({ element: balloon.element, type: 'popped', handler: popHandler });
        
        this.gameContainer.appendChild(balloon.element);
        this.balloons.push(balloon);
    }

    onBalloonPopped(balloon) {
        this.gameManager.incrementScore();
        this.removeBalloon(balloon);
        this.createBalloon();
    }

    removeBalloon(balloon) {
        this.balloons = this.balloons.filter(b => b !== balloon);
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
        this.balloons.forEach(balloon => {
            if (balloon.element.parentNode) {
                balloon.element.parentNode.removeChild(balloon.element);
            }
        });
        this.balloons = [];

        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = [];

        while (this.gameContainer.firstChild) {
            this.gameContainer.removeChild(this.gameContainer.firstChild);
        }
    }

    checkClearCondition(score) {
        return score >= this.clearCondition;
    }
}
