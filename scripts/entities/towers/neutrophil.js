class Neutrophil extends BaseTower {
    constructor(x, y, id) {
        super(x, y, id, IMMUNE_CELL_CONFIGS.NEUTROPHIL);
        this.apply_adjuvant_hp_bonus();
        this.start_time = null;
        this.has_exploded = false;
        this.countdown_pulsate = new PulsateEffect();
        this.is_counting_down = false;
    }

    apply_adjuvant_hp_bonus() {
        if (window.game_state && window.game_state.resource_system) {
            const hp_multiplier = window.game_state.resource_system.get_adjuvant_hp_multiplier();
            this.hp = Math.ceil(this.config.base_hp * hp_multiplier);
            this.max_hp = this.hp;
        }
    }

    check_activity_criteria() {
        return !this.has_exploded;
    }

    update(timestamp) {
        if (this.has_exploded) {
            return;
        }

        if (!this.start_time) {
            this.start_countdown(timestamp);
        }

        this.update_countdown_visual();
        this.check_enemy_contact();
        this.check_countdown_completion(timestamp);
    }

    start_countdown(timestamp) {
        this.start_time = this.get_current_adjusted_time(timestamp);
        this.is_counting_down = true;
        this.countdown_pulsate.trigger();
    }

    get_current_adjusted_time(timestamp) {
        if (window.game_state && window.game_state.get_adjusted_elapsed_time) {
            return window.game_state.get_adjusted_elapsed_time(0);
        }
        return timestamp;
    }

    get_adjusted_elapsed_time_since_start(timestamp) {
        if (!this.start_time) {
            return 0;
        }
        
        const current_adjusted_time = this.get_current_adjusted_time(timestamp);
        return current_adjusted_time - this.start_time;
    }

    update_countdown_visual() {
        if (this.is_counting_down && !this.has_exploded) {
            this.countdown_pulsate.trigger();
        }
        this.countdown_pulsate.update();
    }

    check_enemy_contact() {
        if (!window.game_state || !window.game_state.enemies || this.has_exploded) {
            return;
        }

        for (const enemy of window.game_state.enemies) {
            const distance = MathUtils.get_distance(this.x, this.y, enemy.x, enemy.y);
            if (distance < this.radius + enemy.radius) {
                this.explode();
                return;
            }
        }
    }

    check_countdown_completion(timestamp) {
        if (this.has_exploded || !this.start_time) {
            return;
        }

        const elapsed = this.get_adjusted_elapsed_time_since_start(timestamp);
        if (elapsed >= this.config.countdown_duration_ms) {
            this.explode();
        }
    }

    explode() {
        if (this.has_exploded) {
            return;
        }

        this.has_exploded = true;
        this.hp = 0;
        
        this.create_explosion_effect();
        this.trigger_screen_shake();
        this.deal_explosion_damage();
    }

    create_explosion_effect() {
        if (window.game_state && window.game_state.effects) {
            const explosion = new ExplosionEffect(this.x, this.y, this.config.explosion_radius);
            window.game_state.effects.push(explosion);
        }
    }

    trigger_screen_shake() {
        if (window.game_state && window.game_state.screen_shake) {
            window.game_state.screen_shake.trigger(
                GAME_CONFIG.SCREEN_SHAKE_MAGNITUDE,
                GAME_CONFIG.SCREEN_SHAKE_DURATION_FRAMES
            );
        }
    }

    deal_explosion_damage() {
        if (!window.game_state || !window.game_state.enemies) {
            return;
        }

        const damage = this.calculate_explosion_damage();
        const affected_enemies = this.get_enemies_in_explosion_radius();

        affected_enemies.forEach(enemy => {
            this.damage_enemy(enemy, damage);
        });
    }

    calculate_explosion_damage() {
        let base_damage = this.config.base_damage;
        
        base_damage = this.apply_adaptation_damage_multiplier(base_damage);
        base_damage = this.apply_resource_damage_multiplier(base_damage);
        
        return base_damage;
    }

    apply_adaptation_damage_multiplier(base_damage) {
        const multiplier = this.get_adaptation_damage_multiplier();
        return Math.ceil(base_damage * multiplier);
    }

    apply_resource_damage_multiplier(base_damage) {
        if (window.game_state && window.game_state.resource_system) {
            return window.game_state.resource_system.apply_damage_bonus(base_damage);
        }
        return base_damage;
    }

    get_adaptation_damage_multiplier() {
        if (window.game_state && window.game_state.adaptation_system) {
            return window.game_state.adaptation_system.get_total_damage_multiplier();
        }
        return 1.0;
    }

    get_enemies_in_explosion_radius() {
        if (!window.game_state || !window.game_state.enemies) {
            return [];
        }

        return window.game_state.enemies.filter(enemy => {
            const distance = MathUtils.get_distance(this.x, this.y, enemy.x, enemy.y);
            return distance <= this.config.explosion_radius;
        });
    }

    damage_enemy(enemy, damage) {
        const is_destroyed = enemy.take_damage(damage);
        
        if (window.game_state && window.game_state.damage_numbers) {
            window.game_state.damage_numbers.push(new DamageNumber(enemy.x, enemy.y, damage));
        }

        if (is_destroyed) {
            this.handle_enemy_destroyed(enemy);
        }
    }

    handle_enemy_destroyed(enemy) {
        if (!window.game_state) {
            return;
        }

        if (window.game_state.effects) {
            window.game_state.effects.push(new PopEffect(enemy.x, enemy.y, enemy.color));
        }

        if (window.game_state.resource_system) {
            window.game_state.resource_system.spawn_particles_from_enemy(enemy, window.game_state);
        }

        const enemy_index = window.game_state.enemies.indexOf(enemy);
        if (enemy_index !== -1) {
            window.game_state.enemies.splice(enemy_index, 1);
        }

        window.game_state.killcount++;
        window.game_state.total_killcount++;
        
        if (window.game_state.intensity_gauge_pulsate) {
            window.game_state.intensity_gauge_pulsate.trigger();
        }

        if (window.game_state.adaptation_system) {
            window.game_state.adaptation_system.handle_enemy_killed();
        }

        if (window.game_state.killcount >= window.game_state.killcount_required) {
            this.handle_intensity_level_up();
        }
    }

    handle_intensity_level_up() {
        if (!window.game_state || window.game_state.intensity_level >= INTENSITY_CONFIG.MAX_INTENSITY_LEVEL) {
            return;
        }

        window.game_state.intensity_level++;
        window.game_state.killcount = 0;
        window.game_state.killcount_required = Math.ceil(
            window.game_state.killcount_required * INTENSITY_CONFIG.KILLCOUNT_SCALING_FACTOR
        );
        window.game_state.killcount_required = Math.min(
            window.game_state.killcount_required,
            INTENSITY_CONFIG.MAX_KILLCOUNT_REQUIREMENT
        );
        
        if (window.game_state.intensity_level_pulsate) {
            window.game_state.intensity_level_pulsate.trigger();
        }

        if (window.game_state.adaptation_system) {
            window.game_state.adaptation_system.apply_regenerative_cycle_healing();
        }

        if (window.game_state.intensity_reward_system) {
            window.game_state.is_game_paused = true;
            window.game_state.intensity_reward_system.show_intensity_reward_modal();
        }
    }

    draw_base(ctx) {
        this.update_pulsate();
        
        let display_color = this.config.color;
        let display_opacity = 1.0;
        
        if (this.is_counting_down && !this.has_exploded) {
            const countdown_progress = this.get_countdown_progress();
            const flash_intensity = Math.sin(countdown_progress * Math.PI * 10) * 0.3 + 0.7;
            display_color = `rgba(255, 105, 180, ${flash_intensity})`;
        }
        
        if (this.has_exploded) {
            display_opacity = 0.3;
        }

        ctx.save();
        ctx.globalAlpha = display_opacity;
        ctx.fillStyle = display_color;
        ctx.strokeStyle = this.config.stroke_color;
        ctx.lineWidth = this.config.stroke_width;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    get_countdown_progress() {
        if (!this.start_time) {
            return 0;
        }

        const elapsed = this.get_adjusted_elapsed_time_since_start(performance.now());
        return Math.min(elapsed / this.config.countdown_duration_ms, 1.0);
    }

    is_alive() {
        return !this.has_exploded;
    }
}

window.Neutrophil = Neutrophil;