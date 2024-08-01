import GameManager from './modules/game_manager.js';
import Stage01SimplePop from './stages/stage_01_simple_pop.js';

const gameContainer = document.getElementById('game-container');
const gameManager = new GameManager(gameContainer);

function startGame() {
    const stage = new Stage01SimplePop(gameManager);
    gameManager.setCurrentStage(stage);
    stage.start();
}

// ページの読み込みが完了したらゲームを開始
window.addEventListener('load', startGame);
