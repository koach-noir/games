export default class GameManager {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.currentStage = null;
        this.score = 0;
    }

    setCurrentStage(stage) {
        if (this.currentStage) {
            this.currentStage.cleanup();
        }
        this.currentStage = stage;
        this.score = 0;
    }

    incrementScore(points = 1) {
        this.score += points;
        console.log(`Score: ${this.score}`); // 後でUIに表示するように変更可能
    }

    getGameContainer() {
        return this.gameContainer;
    }

    // 後で追加する機能のためのメソッド
    // 例: ゲームオーバー処理、難易度変更、etc.
}
