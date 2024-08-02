export default class OperationManager {
    constructor() {
        this.modes = ['rock', 'scissors', 'paper'];
        this.currentModeIndex = 0;
        this.toggleSwitch = null;
    }

    initToggleSwitch() {
        this.toggleSwitch = document.getElementById('toggle-switch');
        if (!this.toggleSwitch) {
            console.error('Toggle switch element not found');
            return;
        }
        this.toggleSwitch.addEventListener('click', this.cycleMode.bind(this));
        this.updateToggleSwitchImage();
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
