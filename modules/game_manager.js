export default class GameManager {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.currentStage = null;
        this.score = 0;
        this.onStageClear = null;
        this.celebrationAudio = null;
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
        console.log(`Score: ${this.score}`);
        if (this.currentStage.checkClearCondition(this.score)) {
            this.onStageClear();
        }
    }

    getGameContainer() {
        return this.gameContainer;
    }

    setCelebrationAudio(audio) {
        this.celebrationAudio = audio;
    }

    stopCelebrationAudio() {
        if (this.celebrationAudio) {
            this.celebrationAudio.pause();
            this.celebrationAudio.currentTime = 0;
        }
    }

    showStageNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'absolute';
        notification.style.top = '10px';
        notification.style.left = '10px';
        notification.style.background = 'rgba(255, 255, 255, 0.7)';
        notification.style.padding = '5px';
        notification.style.borderRadius = '5px';
        this.gameContainer.appendChild(notification);
        setTimeout(() => {
            this.gameContainer.removeChild(notification);
        }, 3000);
    }
}
