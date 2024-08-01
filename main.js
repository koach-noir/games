import GameManager from './modules/game_manager.js';
import Stage01SimplePop from './stages/stage_01_simple_pop.js';
import Stage02SimplePop from './stages/stage_02_simple_pop.js';

const gameContainer = document.getElementById('game-container');
if (!gameContainer) {
    console.error('Game container not found');
    throw new Error('Game container not found');
}

const gameManager = new GameManager(gameContainer);
gameManager.setDebugMode(true); // デバッグモードを有効化（必要に応じてfalseに設定）

const stages = [Stage01SimplePop, Stage02SimplePop];
let currentStageIndex = 0;

function startNextStage() {
    if (currentStageIndex < stages.length) {
        const container = gameManager.getGameContainer();
        if (container) {
            container.innerHTML = ''; // コンテナをクリア
        }
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
    const popupStyles = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000'
    };
    Object.assign(popupOverlay.style, popupStyles);

    const popup = document.createElement('div');
    popup.style.cssText = `
        background-color: white;
        padding: 20px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 0 20px rgba(0,0,0,0.3);
    `;

    const message = document.createElement('p');
    message.textContent = 'おめでとう！すべてのステージをクリアしたよ！';
    message.style.cssText = `
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: bold;
        color: #FF4500;
    `;

    const restartButton = createRestartButton();

    popup.appendChild(message);
    popup.appendChild(restartButton);
    popupOverlay.appendChild(popup);
    document.body.appendChild(popupOverlay);
}

function createRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'もう一度あそぶ！';
    restartButton.style.cssText = `
        padding: 15px 30px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 50px;
        box-shadow: 0 5px 0 #45a049;
        transition: all 0.1s;
    `;
    
    restartButton.addEventListener('mouseover', () => {
        restartButton.style.transform = 'translateY(2px)';
        restartButton.style.boxShadow = '0 3px 0 #45a049';
    });
    restartButton.addEventListener('mouseout', () => {
        restartButton.style.transform = 'translateY(0)';
        restartButton.style.boxShadow = '0 5px 0 #45a049';
    });
    restartButton.addEventListener('click', () => {
        const popupOverlay = document.querySelector('div[style*="position: fixed"]');
        if (popupOverlay) {
            document.body.removeChild(popupOverlay);
        }
        restartGame();
    });

    return restartButton;
}

function playCelebrationSound() {
    const audio = new Audio('resources/common/celebration_clap.mp3');
    audio.loop = true;
    audio.play().catch(error => console.error('Error playing audio:', error));
    gameManager.setCelebrationAudio(audio);
}

function restartGame() {
    currentStageIndex = 0;
    gameManager.stopCelebrationAudio();
    gameManager.reset();
    startNextStage();
}

gameManager.onStageClear = startNextStage;

// ページの読み込みが完了したらゲームを開始
window.addEventListener('load', startNextStage);
