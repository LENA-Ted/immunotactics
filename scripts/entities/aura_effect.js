class BaseAura {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.opacity = AURA_CONFIG.AURA_PULSE_OPACITY_MAX;
        this.max_opacity = AURA_CONFIG.AURA_PULSE_OPACITY_MAX;
        this.min_opacity = AURA_CONFIG.AURA_PULSE_OPACITY_MIN;
        this.pulse_speed = AURA_CONFIG.AURA_PULSE_SPEED;
        this.pulse_direction = 1;
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
    }

    draw(ctx) {
        this.draw_filled_circle(ctx);
    }

    draw_filled_circle(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity * AURA_CONFIG.FILLED_CIRCLE_OPACITY_MULTIPLIER;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = this.opacity * AURA_CONFIG.CIRCLE_OUTLINE_OPACITY_MULTIPLIER;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = AURA_CONFIG.AURA_OUTLINE_LINE_WIDTH;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

class CandidaHealingAura extends BaseAura {
    constructor(x, y, radius) {
        super(x, y, radius, PATHOGEN_CONFIGS.CANDIDA.color);
    }
}

class AdenovirusPermeationAura extends BaseAura {
    constructor(x, y, radius) {
        super(x, y, radius, PATHOGEN_CONFIGS.ADENOVIRUS.color);
    }
}

window.BaseAura = BaseAura;
window.CandidaHealingAura = CandidaHealingAura;
window.AdenovirusPermeationAura = AdenovirusPermeationAura;