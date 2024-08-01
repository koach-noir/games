export default class Balloon {
    constructor(config) {
        this.size = config.size || 100;
        this.type = config.type || 'b01';
        this.element = this.createElement();
    }

    createElement() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.width = `${this.size}px`;
        balloon.style.height = `${this.size}px`;
        balloon.style.backgroundImage = `url('resources/balloon/${this.type}.png')`;
        return balloon;
    }

    setPosition(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    pop() {
        this.element.style.backgroundImage = `url('resources/balloon/${this.type}_pop.png')`;
        this.element.classList.add('popped');
        this.playPopSound();
    }

    playPopSound() {
        const audio = new Audio(`resources/balloon/${this.type}_pop.mp3`);
        audio.play();
    }
}
