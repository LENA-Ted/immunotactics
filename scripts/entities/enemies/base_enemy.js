class BaseEnemy {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.config = config;
        this.hp = this.generate_hp();
        this.max_hp = this.hp;
        this.displayed_hp = this.hp;
        this.speed = this.generate_speed();
        this.radius = this.generate_radius();
        this.color = this.generate_color();
        this.pulsate_effect = new PulsateEffect();
    }

    generate_hp() {
        const base_hp = MathUtils.get_random_int(this.config.min_hp, this.config.max_hp);
        return this.apply_intensity_hp_modifier(base_hp);
    }

    apply_intensity_hp_modifier(base_hp) {
        if (!window.game_state) {
            return base_hp;
        }

        const intensity_level = window.game_state.intensity_level || 0;
        const hp_multiplier = 1 + (intensity_level * INTENSITY_CONFIG.HP_MODIFIER_PER_LEVEL);
        return Math.ceil(base_hp * hp_multiplier);
    }

    generate_speed() {
        return MathUtils.get_random_float(this.config.min_speed, this.config.max_speed);
    }

    generate_radius() {
        const size_modifier = MathUtils.get_random_float(this.config.min_size_mod, this.config.max_size_mod);
        return this.config.base_radius * size_modifier;
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

    update(target) {
        this.move_toward_target(target);
    }

    move_toward_target(target) {
        const angle = MathUtils.get_angle_between(this.x, this.y, target.x, target.y);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
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