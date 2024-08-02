export default class GameManager {
    constructor(gameContainer) {
        if (!gameContainer) {
            throw new Error('GameContainer is required');
        }
        this.gameContainer = gameContainer;
        this.currentStage = null;
        this.score = 0;
        this.onStageClear = null;
        this.celebrationAudio = null;
        this.debug = false;
    }

    setCurrentStage(stage) {
        if (this.currentStage) {
            this.currentStage.cleanup();
        }
        this.currentStage = stage;
        this.score = 0;
        this.log('New stage set');
    }

    incrementScore(points = 1) {
        this.score += points;
        this.log(`Score incremented. New score: ${this.score}`);
        if (this.currentStage && this.currentStage.checkClearCondition(this.score)) {
            this.log('Stage clear condition met');
            if (typeof this.onStageClear === 'function') {
                this.onStageClear();
            } else {
                this.log('Warning: onStageClear is not set or not a function', 'warn');
            }
        }
    }

    getGameContainer() {
        return this.gameContainer;
    }

    setCelebrationAudio(audio) {
        this.celebrationAudio = audio;
        this.log('Celebration audio set');
    }

    stopCelebrationAudio() {
        if (this.celebrationAudio) {
            this.celebrationAudio.pause();
            this.celebrationAudio.currentTime = 0;
            this.log('Celebration audio stopped');
        }
    }

    showStageNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(255, 255, 255, 0.7);
            padding: 5px;
            border-radius: 5px;
            z-index: 1000;
        `;
        this.gameContainer.appendChild(notification);
        this.log(`Stage notification shown: ${message}`);
        setTimeout(() => {
            if (this.gameContainer.contains(notification)) {
                this.gameContainer.removeChild(notification);
                this.log('Stage notification removed');
            }
        }, 3000);
    }

    clearContainer() {
        while (this.gameContainer.firstChild) {
            this.gameContainer.removeChild(this.gameContainer.firstChild);
        }
    }

    reset() {
        this.score = 0;
        this.clearContainer();
        if (this.currentStage) {
            this.currentStage.cleanup();
        }
        this.currentStage = null;
        this.stopCelebrationAudio();
        this.log('Game manager reset');
    }

    setDebugMode(isDebug) {
        this.debug = isDebug;
        this.log(`Debug mode ${isDebug ? 'enabled' : 'disabled'}`);
    }

    log(message, level = 'log') {
        if (this.debug) {
            console[level](`[GameManager] ${message}`);
        }
    }
}
