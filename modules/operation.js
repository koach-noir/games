export default class OperationManager {
    constructor() {
        this.modes = ['rock', 'scissors', 'paper'];
        this.currentModeIndex = 0;
        this.toggleSwitch = null;
    }

    initToggleSwitch() {
        this.toggleSwitch = this.createToggleSwitch();
        document.body.appendChild(this.toggleSwitch);
        this.updateToggleSwitchImage();
    }

    createToggleSwitch() {
        const toggleSwitch = document.createElement('div');
        toggleSwitch.id = 'toggle-switch';
        toggleSwitch.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 80px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
            border: 4px solid red;
            border-radius: 50%;
            background-color: yellow;
            z-index: 9999;
        `;
        toggleSwitch.addEventListener('click', this.cycleMode.bind(this));
        return toggleSwitch;
    }

    cycleMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.updateToggleSwitchImage();
    }

    updateToggleSwitchImage() {
        if (this.toggleSwitch) {
            this.toggleSwitch.style.backgroundImage = `url('resources/common/operation_${this.getCurrentMode()}.gif')`;
        }
    }

    getCurrentMode() {
        return this.modes[this.currentModeIndex];
    }

    balloon_rock(balloon, event) {
        const force = 10;
        const angle = Math.random() * Math.PI * 2;
        const dx = Math.cos(angle) * force;
        const dy = Math.sin(angle) * force;
        
        const currentLeft = parseInt(balloon.element.style.left);
        const currentTop = parseInt(balloon.element.style.top);
        
        balloon.setPosition(currentLeft + dx, currentTop + dy);
        balloon.applyInertia(dx, dy);
    }

    balloon_scissors(balloon) {
        balloon.pop();
    }

    balloon_paper(balloon, event) {
        const rect = balloon.element.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const moveBallon = (e) => {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            balloon.setPosition(newX, newY);
        };

        const stopMoving = () => {
            document.removeEventListener('mousemove', moveBallon);
            document.removeEventListener('mouseup', stopMoving);
            document.removeEventListener('touchmove', moveBallon);
            document.removeEventListener('touchend', stopMoving);
        };

        document.addEventListener('mousemove', moveBallon);
        document.addEventListener('mouseup', stopMoving);
        document.addEventListener('touchmove', moveBallon);
        document.addEventListener('touchend', stopMoving);
    }
}
