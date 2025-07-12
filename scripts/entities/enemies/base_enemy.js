class BaseEnemy {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.config = config;
        this.size_modifier = this.generate_size_modifier();
        this.hp = this.generate_hp_from_size();
        this.max_hp = this.hp;
        this.displayed_hp = this.hp;
        this.base_speed = this.generate_speed_from_size();
        this.current_speed = this.base_speed;
        this.radius = this.generate_radius_from_size();
        this.color = this.generate_color();
        this.pulsate_effect = new PulsateEffect();
        this.status_effects = [];
    }

    generate_size_modifier() {
        return MathUtils.get_random_float(this.config.min_size_mod, this.config.max_size_mod);
    }

    get_size_baseline() {
        return (this.config.min_size_mod + this.config.max_size_mod) / 2;
    }

    get_size_deviation_factor() {
        const baseline = this.get_size_baseline();
        return (this.size_modifier - baseline) / baseline;
    }

    generate_hp_from_size() {
        const hp_baseline = (this.config.min_hp + this.config.max_hp) / 2;
        const deviation_factor = this.get_size_deviation_factor();
        const size_modified_hp = hp_baseline * (1 + deviation_factor);
        return this.apply_intensity_hp_modifier(size_modified_hp);
    }

    generate_speed_from_size() {
        const speed_baseline = (this.config.min_speed + this.config.max_speed) / 2;
        const deviation_factor = this.get_size_deviation_factor();
        return speed_baseline * (1 - deviation_factor);
    }

    generate_radius_from_size() {
        return this.config.base_radius * this.size_modifier;
    }

    apply_intensity_hp_modifier(base_hp) {
        if (!window.game_state) {
            return base_hp;
        }

        const intensity_level = window.game_state.intensity_level || 0;
        const hp_multiplier = Math.pow(1 + INTENSITY_CONFIG.HP_EXPONENTIAL_BASE, intensity_level);
        return Math.ceil(base_hp * hp_multiplier);
    }

    generate_color() {
        return `hsl(${Math.random() * 360}, 70%, 50%)`;
    }

    trigger_pulsate() {
        this.pulsate_effect.trigger();
    }

    update_pulsate() {
        this.pulsate_effect.update();
    }

    update_status_effects(timestamp) {
        this.status_effects = this.status_effects.filter(effect => {
            effect.update(timestamp);
            if (effect.is_expired()) {
                effect.remove_effect(this);
                return false;
            }
            return true;
        });
        
        this.calculate_current_speed();
    }

    calculate_current_speed() {
        this.current_speed = this.base_speed;
        
        this.status_effects.forEach(effect => {
            if (effect.get_type() === 'INTERFERED') {
                this.current_speed *= effect.get_speed_multiplier();
            }
        });
    }

    add_status_effect(effect) {
        const existing_effect_index = this.status_effects.findIndex(
            existing => existing.get_type() === effect.get_type()
        );
        
        if (existing_effect_index !== -1) {
            this.status_effects[existing_effect_index].remove_effect(this);
            this.status_effects.splice(existing_effect_index, 1);
        }
        
        this.status_effects.push(effect);
        effect.apply_effect(this);
    }

    has_status_effect(effect_type) {
        return this.status_effects.some(effect => effect.get_type() === effect_type);
    }

    draw_hp_gauge(ctx) {
        this.displayed_hp = MathUtils.lerp(this.displayed_hp, this.hp, 0.1);
        const hp_angle = (this.displayed_hp / this.max_hp) * Math.PI * 2;
        const gauge_radius = this.radius + 5;
        const scale = this.pulsate_effect.get_scale();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(scale, scale);
        ctx.translate(-this.x, -this.y);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, gauge_radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#00000040';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, gauge_radius, -Math.PI / 2, -Math.PI / 2 + hp_angle);
        ctx.strokeStyle = GAME_CONFIG.COLOR_ENEMY_HP;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.restore();
    }

    draw_body(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.config.stroke_color;
        ctx.lineWidth = this.config.stroke_width;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    draw(ctx) {
        this.update_pulsate();
        this.draw_body(ctx);
        this.draw_hp_gauge(ctx);
    }

    update(target, timestamp) {
        this.update_status_effects(timestamp);
        this.move_toward_target(target);
    }

    move_toward_target(target) {
        const angle = MathUtils.get_angle_between(this.x, this.y, target.x, target.y);
        this.x += Math.cos(angle) * this.current_speed;
        this.y += Math.sin(angle) * this.current_speed;
    }

    take_damage(amount) {
        this.hp -= amount;
        this.trigger_pulsate();
        return this.hp <= 0;
    }

    is_alive() {
        return this.hp > 0;
    }
}

window.BaseEnemy = BaseEnemy;