import Balloon from '../modules/balloon.js';

export default class Stage02SimplePop {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.gameContainer = gameManager.getGameContainer();
        this.balloonCount = 5;
        this.balloons = [];
        this.clearCondition = 3;
        this.tapCount = {};
    }

    start() {
        this.createBalloons();
        this.gameManager.showStageNotification("Stage 2: Pop 3 balloons! Each balloon needs 5 taps.");
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

        balloon.element.addEventListener('click', () => this.tapBalloon(balloon));
        
        this.gameContainer.appendChild(balloon.element);
        this.balloons.push(balloon);
        this.tapCount[balloon.id] = 0;
    }

    tapBalloon(balloon) {
        this.tapCount[balloon.id]++;
        if (this.tapCount[balloon.id] >= 5) {
            this.popBalloon(balloon);
        } else {
            balloon.element.style.transform = `scale(${1 + this.tapCount[balloon.id] * 0.1})`;
        }
    }

    popBalloon(balloon) {
        balloon.pop();
        this.gameManager.incrementScore();
        
        setTimeout(() => {
            this.gameContainer.removeChild(balloon.element);
            this.balloons = this.balloons.filter(b => b !== balloon);
            delete this.tapCount[balloon.id];
            this.createBalloon();
        }, 300);
    }

    getRandomBalloonType() {
        const types = ['b01', 'b02', 'b03', 'b04', 'b05'];
        return types[Math.floor(Math.random() * types.length)];
    }

    cleanup() {
        this.balloons.forEach(balloon => {
            this.gameContainer.removeChild(balloon.element);
        });
        this.balloons = [];
        this.tapCount = {};
    }

    checkClearCondition(score) {
        return score >= this.clearCondition;
    }
}
