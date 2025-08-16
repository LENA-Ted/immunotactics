class BaseEnemy {
    constructor(x, y, config, category, type) {
        this.x = x;
        this.y = y;
        this.config = config;
        this.category = category;
        this.type = type;
        this.size_modifier = this.generate_size_modifier();
        this.hp = this.generate_hp_from_size();
        this.max_hp = this.hp;
        this.displayed_hp = this.hp;
        this.base_speed = this.generate_speed_from_size();
        this.current_speed = this.base_speed;
        this.base_radius = this.generate_radius_from_size();
        this.radius = this.base_radius;
        this.color = this.generate_color();
        this.pulsate_effect = new PulsateEffect();
        this.status_effects = [];
        this.inoculated_size_multiplier = 1.0;
        this.inoculated_speed_multiplier = 1.0;
        this.immunity_feedback_timer = 0;
        this.healing_flag = false;
        this.permeated_flag = false;
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
        if (this.config.color) {
            return this.config.color;
        }
        return `hsl(${Math.random() * 360}, 70%, 50%)`;
    }

    get_category() {
        return this.category;
    }

    get_type() {
        return this.type;
    }

    is_microbe() {
        return this.category === ENEMY_CATEGORIES.MICROBE;
    }

    is_pathogen() {
        return this.category === ENEMY_CATEGORIES.PATHOGEN;
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
        this.update_immunity_feedback_timer();
        this.apply_healing_if_flagged(timestamp);
    }

    apply_healing_if_flagged(timestamp) {
        if (!this.healing_flag) {
            return;
        }

        if (!this.last_heal_time) {
            this.last_heal_time = this.get_current_adjusted_time(timestamp);
            return;
        }

        const heal_interval_ms = PATHOGEN_CONFIGS.CANDIDA.heal_interval_ms;
        const heal_percentage = PATHOGEN_CONFIGS.CANDIDA.heal_percentage;
        const adjusted_elapsed = this.get_adjusted_elapsed_time_since_last_heal(timestamp);
        
        if (adjusted_elapsed >= heal_interval_ms) {
            const heal_amount = Math.ceil(this.max_hp * heal_percentage);
            this.hp = Math.min(this.max_hp, this.hp + heal_amount);
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
        const current_adjusted_time = this.get_current_adjusted_time(timestamp);
        return current_adjusted_time - this.last_heal_time;
    }

    update_immunity_feedback_timer() {
        if (this.immunity_feedback_timer > 0) {
            this.immunity_feedback_timer--;
        }
    }

    calculate_current_speed() {
        this.current_speed = this.base_speed * this.inoculated_speed_multiplier;
        
        const is_paralyzed = this.has_status_effect('PARALYZED');
        if (is_paralyzed) {
            this.current_speed = 0;
            return;
        }
        
        this.status_effects.forEach(effect => {
            if (effect.get_type() === 'INTERFERED') {
                this.current_speed *= effect.get_speed_multiplier();
            }
        });
    }

    add_status_effect(effect) {
        if (this.is_immune_to_status_effect(effect)) {
            this.trigger_immunity_feedback();
            return false;
        }

        const existing_effect_index = this.status_effects.findIndex(
            existing => existing.get_type() === effect.get_type()
        );
        
        if (existing_effect_index !== -1) {
            this.status_effects[existing_effect_index].remove_effect(this);
            this.status_effects.splice(existing_effect_index, 1);
        }
        
        this.status_effects.push(effect);
        effect.apply_effect(this);
        return true;
    }

    is_immune_to_status_effect(effect) {
        if (!effect) {
            return false;
        }

        if (!this.has_inoculated_status()) {
            return false;
        }

        return effect.is_from_immune_cell();
    }

    has_inoculated_status() {
        return this.has_status_effect('INOCULATED');
    }

    trigger_immunity_feedback() {
        this.immunity_feedback_timer = STATUS_EFFECT_CONFIG.IMMUNITY_FEEDBACK_DURATION_FRAMES;
        
        if (window.game_state && window.game_state.effects) {
            const immunity_text = new ImmunityFeedbackText(this.x, this.y);
            window.game_state.effects.push(immunity_text);
        }
    }

    has_status_effect(effect_type) {
        return this.status_effects.some(effect => effect.get_type() === effect_type);
    }

    apply_inoculated_bonuses(size_multiplier, speed_multiplier) {
        this.inoculated_size_multiplier = size_multiplier;
        this.inoculated_speed_multiplier = speed_multiplier;
        this.radius = this.base_radius * this.inoculated_size_multiplier;
    }

    remove_inoculated_bonuses() {
        this.inoculated_size_multiplier = 1.0;
        this.inoculated_speed_multiplier = 1.0;
        this.radius = this.base_radius;
    }

    draw_hp_gauge(ctx) {
        const target_hp = this.hp;
        const hp_difference = Math.abs(this.displayed_hp - target_hp);
        
        if (hp_difference > 0.1) {
            this.displayed_hp = MathUtils.dynamic_ease_lerp(
                this.displayed_hp,
                target_hp,
                GAME_CONFIG.ENEMY_HP_GAUGE_ANIMATION_SPEED,
                GAME_CONFIG.ENEMY_HP_GAUGE_EASING_STRENGTH
            );
        } else {
            this.displayed_hp = target_hp;
        }
        
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
        const is_permeated = this.has_status_effect('PERMEATED');
        const body_opacity = is_permeated ? STATUS_EFFECT_CONFIG.PERMEATED_VISUAL_OPACITY : 1.0;
        
        ctx.save();
        ctx.globalAlpha = body_opacity;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.config.stroke_color;
        ctx.lineWidth = this.config.stroke_width;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
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

class ImmunityFeedbackText {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.text = 'IMMUNE';
        this.life = STATUS_EFFECT_CONFIG.IMMUNITY_FEEDBACK_DURATION_FRAMES;
        this.max_life = STATUS_EFFECT_CONFIG.IMMUNITY_FEEDBACK_DURATION_FRAMES;
        this.opacity = 1.0;
        this.float_speed = 1.0;
        this.color = '#FFD700';
    }

    update() {
        this.y -= this.float_speed;
        this.life--;
        this.opacity = this.life / this.max_life;
    }

    draw(ctx) {
        if (this.life <= 0) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }

    is_alive() {
        return this.life > 0;
    }
}

window.BaseEnemy = BaseEnemy;
window.ImmunityFeedbackText = ImmunityFeedbackText;