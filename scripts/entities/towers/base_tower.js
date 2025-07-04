class BaseTower {
    constructor(x, y, id, config) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.config = config;
        this.radius = config.radius;
        this.hp = config.base_hp;
        this.max_hp = config.base_hp;
        this.pulsate_effect = new PulsateEffect();
        this.last_action_time = 0;
    }

    trigger_pulsate() {
        this.pulsate_effect.trigger();
    }

    update_pulsate() {
        this.pulsate_effect.update();
    }

    draw_base(ctx) {
        this.update_pulsate();
        
        ctx.fillStyle = this.config.color;
        ctx.strokeStyle = this.config.stroke_color;
        ctx.lineWidth = this.config.stroke_width;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    draw_hp(ctx) {
        const scale = this.pulsate_effect.get_scale();
        
        ctx.save();
        ctx.font = `${14 * scale}px Arial`;
        ctx.fillStyle = GAME_CONFIG.COLOR_DARK_BLUE;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.hp, this.x, this.y);
        ctx.restore();
    }

    draw(ctx) {
        this.draw_base(ctx);
        this.draw_hp(ctx);
    }

    update(timestamp) {
        if (!this.last_action_time) {
            this.last_action_time = timestamp;
        }

        if (this.should_perform_action(timestamp)) {
            this.perform_action(timestamp);
            this.last_action_time = timestamp;
        }
    }

    should_perform_action(timestamp) {
        return timestamp - this.last_action_time >= this.config.shoot_interval_ms;
    }

    perform_action(timestamp) {
        
    }

    can_afford_action() {
        return this.hp >= this.config.shoot_hp_cost;
    }

    consume_action_cost() {
        this.hp -= this.config.shoot_hp_cost;
        this.trigger_pulsate();
    }

    is_alive() {
        return this.hp > 0;
    }

    get_cost() {
        return this.config.cost;
    }
}

window.BaseTower = BaseTower;