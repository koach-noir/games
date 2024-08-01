import GameManager from './modules/game_manager.js';
import Stage01SimplePop from './stages/stage_01_simple_pop.js';
import Stage02SimplePop from './stages/stage_02_simple_pop.js';

const gameContainer = document.getElementById('game-container');
const gameManager = new GameManager(gameContainer);

const stages = [Stage01SimplePop, Stage02SimplePop];
let currentStageIndex = 0;

function startNextStage() {
    if (currentStageIndex < stages.length) {
        const StageClass = stages[currentStageIndex];
        const stage = new StageClass(gameManager);
        gameManager.setCurrentStage(stage);
        stage.start();
        currentStageIndex++;
    } else {
        showRestartPopup();
        playCelebrationSound();
    }
}

function showRestartPopup() {
    const popupOverlay = document.createElement('div');
    popupOverlay.style.position = 'fixed';
    popupOverlay.style.top = '0';
    popupOverlay.style.left = '0';
    popupOverlay.style.width = '100%';
    popupOverlay.style.height = '100%';
    popupOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    popupOverlay.style.display = 'flex';
    popupOverlay.style.justifyContent = 'center';
    popupOverlay.style.alignItems = 'center';
    popupOverlay.style.zIndex = '1000';

    const popup = document.createElement('div');
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.textAlign = 'center';

    const message = document.createElement('p');
    message.textContent = 'おめでとう！すべてのステージをクリアしました！';
    message.style.marginBottom = '20px';

    const restartButton = document.createElement('button');
    restartButton.textContent = 'もう一度挑戦する';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '16px';
    restartButton.style.cursor = 'pointer';
    restartButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
        restartGame();
    });

    popup.appendChild(message);
    popup.appendChild(restartButton);
    popupOverlay.appendChild(popup);
    document.body.appendChild(popupOverlay);
}

function playCelebrationSound() {
    const audio = new Audio('resources/common/celebration_clap.mp3');
    audio.loop = true;
    audio.play();
    gameManager.setCelebrationAudio(audio);
}

function restartGame() {
    currentStageIndex = 0;
    gameManager.stopCelebrationAudio();
    gameContainer.innerHTML = '';
    startNextStage();
}

gameManager.onStageClear = startNextStage;

// ページの読み込みが完了したらゲームを開始
window.addEventListener('load', startNextStage);
