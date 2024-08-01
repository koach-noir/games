import GameManager from './modules/game_manager.js';
import Stage01SimplePop from './stages/stage_01_simple_pop.js';
import Stage02SimplePop from './stages/stage_02_simple_pop.js';

const gameContainer = document.getElementById('game-container');
const gameManager = new GameManager(gameContainer);

const stages = [Stage01SimplePop, Stage02SimplePop];
let currentStageIndex = 0;

function startNextStage() {
    if (currentStageIndex < stages.length) {
        gameManager.container.innerHTML = ''; // コンテナをクリア
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
    popup.style.borderRadius = '20px';
    popup.style.textAlign = 'center';
    popup.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';

    const message = document.createElement('p');
    message.textContent = 'おめでとう！すべてのステージをクリアしたよ！';
    message.style.marginBottom = '20px';
    message.style.fontSize = '24px';
    message.style.fontWeight = 'bold';
    message.style.color = '#FF4500';

    const restartButton = document.createElement('button');
    restartButton.textContent = 'もう一度あそぶ！';
    restartButton.style.padding = '15px 30px';
    restartButton.style.fontSize = '20px';
    restartButton.style.fontWeight = 'bold';
    restartButton.style.cursor = 'pointer';
    restartButton.style.backgroundColor = '#4CAF50';
    restartButton.style.color = 'white';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '50px';
    restartButton.style.boxShadow = '0 5px 0 #45a049';
    restartButton.style.transition = 'all 0.1s';
    restartButton.addEventListener('mouseover', () => {
        restartButton.style.transform = 'translateY(2px)';
        restartButton.style.boxShadow = '0 3px 0 #45a049';
    });
    restartButton.addEventListener('mouseout', () => {
        restartButton.style.transform = 'translateY(0)';
        restartButton.style.boxShadow = '0 5px 0 #45a049';
    });
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
    gameManager.reset(); // 新しく追加したリセットメソッドを呼び出す
    startNextStage();
}

gameManager.onStageClear = startNextStage;

// ページの読み込みが完了したらゲームを開始
window.addEventListener('load', () => {
    startNextStage();
});
