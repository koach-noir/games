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
        showRestartButton();
        playCelebrationSound();
    }
}

function showRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game';
    restartButton.addEventListener('click', restartGame);
    gameContainer.appendChild(restartButton);
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
