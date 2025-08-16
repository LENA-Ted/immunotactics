class BaseAura {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.opacity = 0.3;
        this.max_opacity = 0.3;
        this.min_opacity = 0.1;
        this.pulse_speed = 0.02;
        this.pulse_direction = 1;
        this.ray_timer = 0;
        this.ray_duration = 2000;
        this.ray_position = 0;
        this.ray_positions_count = 8;
        this.ray_opacity = 0;
    }

    update_position(x, y) {
        this.x = x;
        this.y = y;
    }

    update_pulse_animation() {
        this.opacity += this.pulse_speed * this.pulse_direction;
        
        if (this.opacity >= this.max_opacity) {
            this.opacity = this.max_opacity;
            this.pulse_direction = -1;
        } else if (this.opacity <= this.min_opacity) {
            this.opacity = this.min_opacity;
            this.pulse_direction = 1;
        }

        this.update_ray_animation();
    }

    update_ray_animation() {
        this.ray_timer += 16;
        
        if (this.ray_timer >= this.ray_duration) {
            this.ray_timer = 0;
            this.ray_position = (this.ray_position + 1) % this.ray_positions_count;
        }

        const ray_progress = this.ray_timer / this.ray_duration;
        
        if (ray_progress < 0.7) {
            this.ray_opacity = ray_progress / 0.7;
        } else {
            this.ray_opacity = 1 - ((ray_progress - 0.7) / 0.3);
        }
        
        this.ray_opacity = Math.max(0, Math.min(1, this.ray_opacity));
    }

    draw(ctx) {
        this.draw_filled_circle(ctx);
        this.draw_ray(ctx);
    }

    draw_filled_circle(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.15;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = this.opacity * 0.6;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    draw_ray(ctx) {
        if (this.ray_opacity <= 0) {
            return;
        }

        const ray_angle = (this.ray_position / this.ray_positions_count) * Math.PI * 2;
        const ray_progress = this.ray_timer / this.ray_duration;
        const eased_progress = this.ease_out_cubic(Math.min(ray_progress / 0.7, 1));
        const ray_length = this.radius * eased_progress;

        const end_x = this.x + Math.cos(ray_angle) * ray_length;
        const end_y = this.y + Math.sin(ray_angle) * ray_length;

        ctx.save();
        ctx.globalAlpha = this.ray_opacity * 0.8;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(end_x, end_y);
        ctx.stroke();
        ctx.restore();
    }

    ease_out_cubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

class CandidaHealingAura extends BaseAura {
    constructor(x, y, radius) {
        super(x, y, radius, '#50C878');
        this.last_heal_time = 0;
        this.heal_interval_ms = 500;
        this.heal_percentage = 0.01;
    }

    update_healing(timestamp, target_entity) {
        if (!target_entity.healing_flag) {
            return;
        }

        const adjusted_elapsed = this.get_adjusted_elapsed_time_since_last_heal(timestamp);
        
        if (adjusted_elapsed >= this.heal_interval_ms) {
            this.heal_entity(target_entity);
            this.last_heal_time = this.get_current_adjusted_time(timestamp);
        }
    }

    get_current_adjusted_time(timestamp) {
        if (window.game_state && window.game_state.get_adjusted_elapsed_time) {
            return window.game_state.get_adjusted_elapsed_time(0);
        }
        return timestamp;
    }

    get_adjusted_elapsed_time_since_last_heal(timestamp) {
        if (!this.last_heal_time) {
            this.last_heal_time = this.get_current_adjusted_time(timestamp);
            return 0;
        }
        
        const current_adjusted_time = this.get_current_adjusted_time(timestamp);
        return current_adjusted_time - this.last_heal_time;
    }

    heal_entity(entity) {
        if (entity.is_alive()) {
            const heal_amount = Math.ceil(entity.max_hp * this.heal_percentage);
            entity.hp = Math.min(entity.max_hp, entity.hp + heal_amount);
        }
    }
}

class AdenovirusPermeationAura extends BaseAura {
    constructor(x, y, radius) {
        super(x, y, radius, '#9370DB');
    }
}

window.BaseAura = BaseAura;
window.CandidaHealingAura = CandidaHealingAura;
window.AdenovirusPermeationAura = AdenovirusPermeationAura;