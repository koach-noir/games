const gameContainer = document.getElementById('game-container');
// const balloonCount = 5;
// const balloonTypes = ['b01', 'b02', 'b03', 'b04', 'b05'];

// function createBalloon() {
//     const balloon = document.createElement('div');
//     balloon.className = 'balloon';
//     const randomType = balloonTypes[Math.floor(Math.random() * balloonTypes.length)];
//     balloon.style.backgroundImage = `url('resources/balloon/${randomType}.png')`;
    
//     const left = Math.random() * (window.innerWidth - 100);
//     const top = Math.random() * (window.innerHeight - 100);
//     balloon.style.left = `${left}px`;
//     balloon.style.top = `${top}px`;

//     balloon.addEventListener('click', () => popBalloon(balloon, randomType));
    
//     gameContainer.appendChild(balloon);
// }

// function popBalloon(balloon, type) {
//     balloon.style.backgroundImage = `url('resources/balloon/${type}_pop.png')`;
//     balloon.classList.add('popped');
    
//     const audio = new Audio(`resources/balloon/${type}_pop.mp3`);
//     audio.play();
    
//     setTimeout(() => {
//         gameContainer.removeChild(balloon);
//         createBalloon();
//     }, 300);
// }

function startGame() {
    for (let i = 0; i < balloonCount; i++) {
        createBalloon();
    }
}

startGame();
