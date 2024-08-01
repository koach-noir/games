import Balloon from '../modules/balloon.js';

export default class Stage02SimplePop {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.gameContainer = gameManager.getGameContainer();
        this.balloonCount = 5;
        this.balloons = [];
        this.clearCondition = 3;
        this.tapCount = {};
        this.eventListeners = [];
    }

    start() {
        this.cleanup(); // 開始前にクリーンアップを実行
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

        const clickHandler = () => this.tapBalloon(balloon);
        balloon.element.addEventListener('click', clickHandler);
        this.eventListeners.push({ element: balloon.element, type: 'click', handler: clickHandler });
        
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
        // イベントリスナーを削除
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
        // 全ての風船を削除
        this.balloons.forEach(balloon => this.removeBalloon(balloon));
        this.balloons = [];

        // 残っているイベントリスナーを削除
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = [];

        // タップカウントをリセット
        this.tapCount = {};

        // ゲームコンテナをクリア
        while (this.gameContainer.firstChild) {
            this.gameContainer.removeChild(this.gameContainer.firstChild);
        }
    }

    checkClearCondition(score) {
        return score >= this.clearCondition;
    }
}
