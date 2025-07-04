class ScreenShake {
    constructor() {
        this.magnitude = 0;
        this.duration = 0;
        this.timer = 0;
    }

    trigger(magnitude, duration) {
        this.magnitude = magnitude;
        this.duration = duration;
        this.timer = duration;
    }

    update() {
        if (this.timer > 0) {
            this.timer--;
        }
    }

    get_offset() {
        if (this.timer <= 0) {
            return { x: 0, y: 0 };
        }
        
        const dx = (Math.random() - 0.5) * this.magnitude;
        const dy = (Math.random() - 0.5) * this.magnitude;
        return { x: dx, y: dy };
    }

    is_active() {
        return this.timer > 0;
    }
}

class PulsateEffect {
    constructor() {
        this.timer = 0;
        this.scale = 1;
        this.duration = GAME_CONFIG.PULSATE_DURATION_FRAMES;
        this.magnitude = GAME_CONFIG.PULSATE_MAGNITUDE;
    }

    trigger() {
        this.timer = this.duration;
    }

    update() {
        if (this.timer <= 0) {
            this.scale = MathUtils.lerp(this.scale, 1, 0.1);
            return;
        }
        
        this.timer--;
        const pulse_progress = this.timer / this.duration;
        this.scale = 1 + Math.sin((1 - pulse_progress) * Math.PI) * this.magnitude;
    }

    get_scale() {
        return this.scale;
    }

    is_pulsating() {
        return this.timer > 0;
    }
}

window.ScreenShake = ScreenShake;
window.PulsateEffect = PulsateEffect;