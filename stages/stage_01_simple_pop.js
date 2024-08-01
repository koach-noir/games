import Balloon from '../modules/balloon.js';

export default class Stage01SimplePop {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.gameContainer = gameManager.getGameContainer();
        this.balloonCount = 5;
        this.balloons = [];
    }

    start() {
        this.createBalloons();
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

        balloon.element.addEventListener('click', () => this.popBalloon(balloon));
        
        this.gameContainer.appendChild(balloon.element);
        this.balloons.push(balloon);
    }

    popBalloon(balloon) {
        balloon.pop();
        this.gameManager.incrementScore();
        
        setTimeout(() => {
            this.gameContainer.removeChild(balloon.element);
            this.balloons = this.balloons.filter(b => b !== balloon);
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
    }
}
