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
        this.is_active = true;
        this.range = this.calculate_range();
    }

    calculate_range() {
        if (this.config.range === null) {
            return null;
        }
        
        if (this.config.range_factor) {
            const canvas_width = window.game_state ? 
                (window.game_state.canvas_width || 800) : 800;
            const canvas_height = window.game_state ? 
                (window.game_state.canvas_height || 600) : 600;
            const canvas_length = Math.min(canvas_width, canvas_height);
            return canvas_length * this.config.range_factor;
        }
        
        return this.config.range;
    }

    update_range() {
        this.range = this.calculate_range();
    }

    trigger_pulsate() {
        this.pulsate_effect.trigger();
    }

    update_pulsate() {
        this.pulsate_effect.update();
    }

    draw_base(ctx) {
        this.update_pulsate();
        
        const display_color = this.is_active ? this.config.color : '#808080';
        
        ctx.fillStyle = display_color;
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

        this.update_activity_state();

        if (this.is_active && this.should_perform_action(timestamp)) {
            this.perform_action(timestamp);
            this.last_action_time = timestamp;
        }
    }

    update_activity_state() {
        this.is_active = this.check_activity_criteria();
    }

    check_activity_criteria() {
        return true;
    }

    should_perform_action(timestamp) {
        const modified_interval = this.get_modified_action_interval();
        return timestamp - this.last_action_time >= modified_interval;
    }

    get_modified_action_interval() {
        const base_interval = this.config.shoot_interval_ms || this.config.action_interval_ms;
        const cooldown_multiplier = this.get_action_cooldown_multiplier();
        return Math.ceil(base_interval * cooldown_multiplier);
    }

    get_action_cooldown_multiplier() {
        if (window.game_state && window.game_state.resource_system) {
            return window.game_state.resource_system.get_action_cooldown_multiplier();
        }
        return 1.0;
    }

    perform_action(timestamp) {
        
    }

    can_afford_action() {
        const cost_key = this.config.shoot_hp_cost || this.config.action_hp_cost;
        return this.hp >= cost_key;
    }

    consume_action_cost() {
        const cost_key = this.config.shoot_hp_cost || this.config.action_hp_cost;
        this.hp -= cost_key;
        this.trigger_pulsate();
    }

    is_alive() {
        return this.hp > 0;
    }

    get_cost() {
        return this.config.cost;
    }

    get_range() {
        return this.range;
    }

    is_in_range(target) {
        if (this.range === null) {
            return true;
        }
        
        const distance = MathUtils.get_distance(this.x, this.y, target.x, target.y);
        return distance <= this.range;
    }
}

window.BaseTower = BaseTower;