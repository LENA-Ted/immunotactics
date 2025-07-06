class Core {
    constructor(canvas_width, canvas_height) {
        this.x = canvas_width / 2;
        this.y = canvas_height / 2;
        this.radius = 20;
        this.hp = GAME_CONFIG.CORE_START_HP;
        this.max_hp = GAME_CONFIG.CORE_MAX_HP;
    }

    draw(ctx) {
        ctx.fillStyle = '#00ffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    take_damage(amount) {
        this.hp -= amount;
        
        if (window.game_state && window.game_state.screen_shake) {
            window.game_state.screen_shake.trigger(
                GAME_CONFIG.SCREEN_SHAKE_MAGNITUDE, 
                GAME_CONFIG.SCREEN_SHAKE_DURATION_FRAMES
            );
        }

        if (this.hp <= 0) {
            this.hp = 0;
            return true;
        }
        return false;
    }

    heal(amount) {
        if (amount <= 0) {
            return;
        }
        
        this.hp = Math.min(this.max_hp, this.hp + amount);
    }

    increase_max_hp(amount) {
        if (amount <= 0) {
            return;
        }
        
        this.max_hp += amount;
    }

    is_alive() {
        return this.hp > 0;
    }

    get_hp_percentage() {
        return this.hp / this.max_hp;
    }
}

window.Core = Core;