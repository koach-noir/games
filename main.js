import GameManager from './modules/game_manager.js';
import OperationManager from './modules/operation.js';
import Stage01SimplePop from './stages/stage_01_simple_pop.js';
import Stage02SimplePop from './stages/stage_02_simple_pop.js';

console.log('main.js executed');

let gameManager, operationManager;
const stages = [Stage01SimplePop, Stage02SimplePop];
let currentStageIndex = 0;

function initGame() {
    console.log('Initializing game');
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container not found');
        throw new Error('Game container not found');
    }

    console.log('gameContainer:', gameContainer);

    gameManager = new GameManager(gameContainer);
    gameManager.setDebugMode(true); // デバッグモードを有効化（必要に応じてfalseに設定）

    operationManager = new OperationManager(gameContainer);
    console.log('OperationManager instantiated');

    gameManager.onStageClear = startNextStage;
    startNextStage();
}

function startNextStage() {
    if (currentStageIndex < stages.length) {
        const container = gameManager.getGameContainer();
        if (container) {
            // トグルスイッチを除外してコンテナをクリア
            Array.from(container.children).forEach(child => {
                if (child.id !== 'toggle-switch') {
                    container.removeChild(child);
                }
            });
        }
        
        // 1秒のディレイを追加
        setTimeout(() => {
            const StageClass = stages[currentStageIndex];
            const stage = new StageClass(gameManager, operationManager);
            gameManager.setCurrentStage(stage);
            stage.start();
            currentStageIndex++;
        }, 1000);
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

// DOMの読み込みが完了したらゲームを初期化
document.addEventListener('DOMContentLoaded', initGame);

// ページの読み込みが完了したらトグルスイッチの存在を確認
window.addEventListener('load', () => {
    setTimeout(() => {
        const toggleSwitch = document.getElementById('toggle-switch');
        if (!toggleSwitch) {
            console.error('Toggle switch not found after page load, creating a new one');
            const newToggleSwitch = document.createElement('div');
            newToggleSwitch.id = 'toggle-switch';
            newToggleSwitch.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 80px;
                height: 80px;
                background-color: yellow;
                border: 4px solid red;
                border-radius: 50%;
                z-index: 9999;
            `;
            document.body.appendChild(newToggleSwitch);
        } else {
            console.log('Toggle switch found after page load:', toggleSwitch);
        }
    }, 1000);
});
