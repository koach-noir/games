import Balloon from '../modules/balloon.js';

export default class Stage02SimplePop {
    constructor(gameManager, operationManager) {
        this.gameManager = gameManager;
        this.operationManager = operationManager;
        this.gameContainer = gameManager.getGameContainer();
        this.balloonCount = 3;
        this.balloons = [];
        this.clearCondition = 10;
        this.eventListeners = [];
    }

    start() {
        this.cleanup();
        this.createBalloons();
        this.gameManager.showStageNotification("Stage 2: Pop 10 balloons!");
    }

    createBalloons() {
        for (let i = 0; i < this.balloonCount; i++) {
            this.createBalloon();
        }
    }

    createBalloon() {
        const balloon = new Balloon({
            type: this.getRandomBalloonType(),
            size: 250,
            gameContainer: this.gameContainer
        });
        
        const left = Math.random() * (this.gameContainer.clientWidth - 100);
        const top = Math.random() * (this.gameContainer.clientHeight - 100);
        balloon.setPosition(left, top);

        const interactionHandler = (e) => this.handleBalloonInteraction(balloon, e.detail.event);
        balloon.element.addEventListener('balloonInteraction', interactionHandler);
        this.eventListeners.push({ element: balloon.element, type: 'balloonInteraction', handler: interactionHandler });

        const poppedHandler = () => this.onBalloonPopped(balloon);
        balloon.element.addEventListener('popped', poppedHandler);
        this.eventListeners.push({ element: balloon.element, type: 'popped', handler: poppedHandler });
        
        this.gameContainer.appendChild(balloon.element);
        this.balloons.push(balloon);
        balloon.startFloating();
    }

    handleBalloonInteraction(balloon, event) {
        const currentMode = this.operationManager.getCurrentMode();
        switch (currentMode) {
            case 'scissors':
                this.operationManager.balloon_scissors(balloon);
                break;
            case 'paper':
                this.operationManager.balloon_paper(balloon, event);
                break;
            case 'rock':
                this.operationManager.balloon_rock(balloon, event);
                break;
        }
    }

    onBalloonPopped(balloon) {
        this.gameManager.incrementScore();
        this.removeBalloon(balloon);
        this.createBalloon();
    }

    removeBalloon(balloon) {
        balloon.cleanup();
        this.balloons = this.balloons.filter(b => b !== balloon);
        this.eventListeners = this.eventListeners.filter(listener => listener.element !== balloon.element);
    }

    getRandomBalloonType() {
        const types = ['b01', 'b02', 'b03', 'b04', 'b05'];
        return types[Math.floor(Math.random() * types.length)];
    }

    cleanup() {
        this.balloons.forEach(balloon => {
            balloon.cleanup();
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
