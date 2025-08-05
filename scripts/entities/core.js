class CoreInvincibilityEffect {
    constructor() {
        this.is_active = false;
        this.start_time = 0;
        this.duration_ms = 0;
        this.opacity = 1.0;
        this.blink_speed_multiplier = 2.0;
    }

    activate(duration_ms) {
        this.is_active = true;
        this.start_time = performance.now();
        this.duration_ms = duration_ms;
    }

    update() {
        if (!this.is_active) {
            this.opacity = 1.0;
            return;
        }

        const current_time = performance.now();
        const elapsed = current_time - this.start_time;

        if (elapsed >= this.duration_ms) {
            this.is_active = false;
            this.opacity = 1.0;
            return;
        }

        const blink_frequency = this.blink_speed_multiplier * 0.005;
        const opacity_variation = Math.sin(elapsed * blink_frequency) * 0.5 + 0.5;
        this.opacity = 0.5 + (opacity_variation * 0.5);
    }

    get_opacity() {
        return this.opacity;
    }

    is_invincible() {
        return this.is_active;
    }
}

class Core {
    constructor(canvas_width, canvas_height) {
        this.x = canvas_width / 2;
        this.y = canvas_height / 2;
        this.radius = 20;
        this.hp = GAME_CONFIG.CORE_START_HP;
        this.base_max_hp = GAME_CONFIG.CORE_MAX_HP;
        this.max_hp = this.base_max_hp;
        this.invincibility_effect = new CoreInvincibilityEffect();
    }

    draw(ctx) {
        this.invincibility_effect.update();
        
        ctx.save();
        ctx.globalAlpha = this.invincibility_effect.get_opacity();
        ctx.fillStyle = '#00ffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    take_damage(amount) {
        if (this.invincibility_effect.is_invincible()) {
            return false;
        }

        this.hp -= amount;
        
        if (window.game_state && window.game_state.screen_shake) {
            window.game_state.screen_shake.trigger(
                GAME_CONFIG.SCREEN_SHAKE_MAGNITUDE, 
                GAME_CONFIG.SCREEN_SHAKE_DURATION_FRAMES
            );
        }

        this.apply_refractory_period();

        if (this.hp <= 0) {
            this.hp = 0;
            return true;
        }
        return false;
    }

    apply_refractory_period() {
        if (!window.game_state || !window.game_state.adaptation_system) {
            return;
        }

        const invincibility_duration = window.game_state.adaptation_system.get_invincibility_duration_ms();
        if (invincibility_duration > 0) {
            this.invincibility_effect.activate(invincibility_duration);
        }
    }

    heal(amount) {
        if (amount <= 0) {
            return;
        }
        
        this.hp = Math.min(this.max_hp, this.hp + amount);
    }

    set_max_hp_bonus(bonus_amount) {
        this.max_hp = this.base_max_hp + bonus_amount;
    }

    heal_to_max() {
        this.hp = this.max_hp;
    }

    is_alive() {
        return this.hp > 0;
    }

    get_hp_percentage() {
        return this.hp / this.max_hp;
    }

    is_invincible() {
        return this.invincibility_effect.is_invincible();
    }
}

window.Core = Core;
window.CoreInvincibilityEffect = CoreInvincibilityEffect;