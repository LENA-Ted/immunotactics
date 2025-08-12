class DendriticCell extends BaseTower {
    constructor(x, y, id) {
        super(x, y, id, IMMUNE_CELL_CONFIGS.DENDRITIC_CELL);
        this.apply_adjuvant_hp_bonus();
        this.has_exploded = false;
        this.pulsate_timer = 0;
        this.pulsate_speed_multiplier = 0.75;
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

        this.update_pulsate_visual();
    }

    update_pulsate_visual() {
        this.pulsate_timer += this.pulsate_speed_multiplier;
    }

    handle_enemy_collision(enemy) {
        if (!this.has_exploded) {
            this.explode();
        }
    }

    explode() {
        if (this.has_exploded) {
            return;
        }

        this.has_exploded = true;
        this.hp = 0;
        
        if (window.game_state && window.game_state.audio_system) {
            window.game_state.audio_system.play_sound('EXPLOSION');
        }
        
        this.create_paralysis_effect();
        this.create_explosion_effect();
        this.trigger_screen_shake();
        this.apply_paralysis_to_enemies();
        this.apply_paracrine_regeneration();
    }

    create_paralysis_effect() {
        if (window.game_state && window.game_state.effects) {
            const paralysis_effect = new ParalysisEffect(
                this.x, 
                this.y, 
                this.config.paralysis_radius
            );
            window.game_state.effects.push(paralysis_effect);
        }
    }

    create_explosion_effect() {
        if (window.game_state && window.game_state.effects) {
            const explosion = new ExplosionEffect(
                this.x, 
                this.y, 
                this.config.paralysis_radius,
                'IMMUNE_CELL',
                this.id
            );
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

    apply_paralysis_to_enemies() {
        if (!window.game_state || !window.game_state.enemies) {
            return;
        }

        const paralysis_duration = this.get_paralysis_duration();
        const affected_enemies = this.get_enemies_in_paralysis_radius();

        affected_enemies.forEach(enemy => {
            const paralyzed_effect = new ParalyzedEffect(paralysis_duration, STATUS_EFFECT_SOURCES.IMMUNE_CELL);
            enemy.add_status_effect(paralyzed_effect);
        });
    }

    get_paralysis_duration() {
        const base_duration = this.config.paralysis_duration_ms;
        
        if (window.game_state && window.game_state.adaptation_system) {
            const multiplier = window.game_state.adaptation_system.get_status_effect_duration_multiplier(STATUS_EFFECT_SOURCES.IMMUNE_CELL);
            return Math.ceil(base_duration * multiplier);
        }
        
        return base_duration;
    }

    get_enemies_in_paralysis_radius() {
        if (!window.game_state || !window.game_state.enemies) {
            return [];
        }

        return window.game_state.enemies.filter(enemy => {
            const distance = MathUtils.get_distance(this.x, this.y, enemy.x, enemy.y);
            return distance <= this.config.paralysis_radius;
        });
    }

    apply_paracrine_regeneration() {
        if (!window.game_state || !window.game_state.adaptation_system) {
            return;
        }

        const heal_amount = window.game_state.adaptation_system.get_immune_explosion_heal();
        if (heal_amount <= 0) {
            return;
        }

        const affected_towers = this.get_towers_in_paralysis_radius();
        affected_towers.forEach(tower => {
            tower.hp = Math.min(tower.max_hp, tower.hp + heal_amount);
        });
    }

    get_towers_in_paralysis_radius() {
        if (!window.game_state || !window.game_state.towers) {
            return [];
        }

        return window.game_state.towers.filter(tower => {
            const distance = MathUtils.get_distance(this.x, this.y, tower.x, tower.y);
            return distance <= this.config.paralysis_radius && tower.id !== this.id;
        });
    }

    draw_base(ctx) {
        this.update_pulsate();
        
        let display_color = this.config.color;
        let display_opacity = 1.0;
        
        if (!this.has_exploded) {
            const pulse_intensity = Math.sin(this.pulsate_timer * 0.05) * 0.3 + 0.7;
            display_color = `rgba(147, 112, 219, ${pulse_intensity})`;
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

    is_alive() {
        return !this.has_exploded;
    }
}

window.DendriticCell = DendriticCell;