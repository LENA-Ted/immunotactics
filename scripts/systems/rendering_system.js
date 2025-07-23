class RenderingSystem {
    constructor(game_canvas, cursor_canvas) {
        this.game_canvas = game_canvas;
        this.cursor_canvas = cursor_canvas;
        this.game_ctx = game_canvas.getContext('2d');
        this.cursor_ctx = cursor_canvas.getContext('2d');
    }

    render_frame(game_state, cursor_state) {
        this.clear_canvases();
        this.apply_screen_shake(game_state.screen_shake);
        this.render_game_entities(game_state);
        this.render_cursor(cursor_state, game_state.player, game_state);
        this.restore_context();
    }

    clear_canvases() {
        const shake_margin = GAME_CONFIG.SCREEN_SHAKE_MAGNITUDE;
        
        this.game_ctx.clearRect(
            -shake_margin, 
            -shake_margin, 
            this.game_canvas.width + shake_margin * 2, 
            this.game_canvas.height + shake_margin * 2
        );
        
        this.cursor_ctx.clearRect(0, 0, this.cursor_canvas.width, this.cursor_canvas.height);
    }

    apply_screen_shake(screen_shake) {
        this.game_ctx.save();
        
        if (screen_shake.is_active()) {
            const offset = screen_shake.get_offset();
            this.game_ctx.translate(offset.x, offset.y);
        }
    }

    restore_context() {
        this.game_ctx.restore();
    }

    render_game_entities(game_state) {
        this.render_core(game_state.core);
        this.render_towers(game_state.towers);
        this.render_enemies(game_state.enemies);
        this.render_projectiles(game_state.projectiles);
        this.render_effects(game_state.effects);
        this.render_damage_numbers(game_state.damage_numbers);
        this.render_resource_particles(game_state.resource_particles);
    }

    render_core(core) {
        core.draw(this.game_ctx);
    }

    render_towers(towers) {
        towers.forEach(tower => {
            tower.draw(this.game_ctx);
        });
    }

    render_enemies(enemies) {
        enemies.forEach(enemy => {
            enemy.draw(this.game_ctx);
        });
    }

    render_projectiles(projectiles) {
        projectiles.forEach(projectile => {
            projectile.draw(this.game_ctx);
        });
    }

    render_effects(effects) {
        effects.forEach(effect => {
            effect.draw(this.game_ctx);
        });
    }

    render_damage_numbers(damage_numbers) {
        damage_numbers.forEach(damage_number => {
            damage_number.draw(this.game_ctx);
        });
    }

    render_resource_particles(resource_particles) {
        if (!resource_particles) {
            return;
        }
        
        resource_particles.forEach(particle => {
            particle.draw(this.game_ctx);
        });
    }

    render_cursor(cursor_state, player, game_state) {
        const gauge_radius = 25;
        const energy_angle = (cursor_state.displayed_energy / player.max_energy) * Math.PI * 2;
        const is_error = cursor_state.error_timer > 0 && Math.floor(cursor_state.error_timer / 5) % 2 === 0;
        const is_free_placement = player.is_in_free_placement_state();

        let background_color = `${GAME_CONFIG.COLOR_DARK_BLUE}40`;
        let energy_color = GAME_CONFIG.COLOR_CREAM;

        if (is_error) {
            background_color = GAME_CONFIG.COLOR_INSUFFICIENT_ENERGY;
            energy_color = GAME_CONFIG.COLOR_INSUFFICIENT_ENERGY;
        } else if (is_free_placement) {
            background_color = `${GAME_CONFIG.COLOR_FREE_PLACEMENT}40`;
            energy_color = GAME_CONFIG.COLOR_FREE_PLACEMENT;
        }

        this.render_energy_gauge(cursor_state, gauge_radius, energy_angle, background_color, energy_color);
        this.render_phenotype_cooldown_gauge(cursor_state, gauge_radius, game_state);
    }

    render_energy_gauge(cursor_state, gauge_radius, energy_angle, background_color, energy_color) {
        this.cursor_ctx.beginPath();
        this.cursor_ctx.arc(cursor_state.x, cursor_state.y, gauge_radius, 0, Math.PI * 2);
        this.cursor_ctx.strokeStyle = background_color;
        this.cursor_ctx.lineWidth = 8;
        this.cursor_ctx.stroke();

        if (energy_angle > 0) {
            this.cursor_ctx.beginPath();
            this.cursor_ctx.arc(
                cursor_state.x, 
                cursor_state.y, 
                gauge_radius, 
                -Math.PI / 2, 
                -Math.PI / 2 + energy_angle
            );
            this.cursor_ctx.strokeStyle = energy_color;
            this.cursor_ctx.lineWidth = 8;
            this.cursor_ctx.lineCap = 'round';
            this.cursor_ctx.stroke();
        }
    }

    render_phenotype_cooldown_gauge(cursor_state, energy_gauge_radius, game_state) {
        if (!game_state.phenotype_system) {
            return;
        }

        const current_time = performance.now();
        const cooldown_progress = game_state.phenotype_system.get_cooldown_progress(current_time);
        const gauge_opacity = game_state.phenotype_system.get_cooldown_gauge_opacity();
        
        if (gauge_opacity <= 0.01) {
            return;
        }

        const active_phenotype = game_state.phenotype_system.get_active_phenotype();
        if (!active_phenotype) {
            return;
        }

        const cooldown_radius = energy_gauge_radius + PHENOTYPE_UI_CONFIG.COOLDOWN_GAUGE_GAP;
        const cooldown_angle = cooldown_progress * Math.PI * 2;
        const is_error_blink = game_state.phenotype_system.is_error_blink_active();
        
        let gauge_color = active_phenotype.get_gauge_color();
        if (is_error_blink) {
            gauge_color = GAME_CONFIG.COLOR_INSUFFICIENT_ENERGY;
        }

        this.cursor_ctx.save();
        this.cursor_ctx.globalAlpha = gauge_opacity;

        this.cursor_ctx.beginPath();
        this.cursor_ctx.arc(cursor_state.x, cursor_state.y, cooldown_radius, 0, Math.PI * 2);
        this.cursor_ctx.strokeStyle = `${gauge_color}40`;
        this.cursor_ctx.lineWidth = PHENOTYPE_UI_CONFIG.COOLDOWN_GAUGE_LINE_WIDTH;
        this.cursor_ctx.stroke();

        if (cooldown_angle > 0) {
            this.cursor_ctx.beginPath();
            this.cursor_ctx.arc(
                cursor_state.x, 
                cursor_state.y, 
                cooldown_radius, 
                -Math.PI / 2, 
                -Math.PI / 2 + cooldown_angle
            );
            this.cursor_ctx.strokeStyle = gauge_color;
            this.cursor_ctx.lineWidth = PHENOTYPE_UI_CONFIG.COOLDOWN_GAUGE_LINE_WIDTH;
            this.cursor_ctx.lineCap = 'round';
            this.cursor_ctx.stroke();
        }

        this.cursor_ctx.restore();
    }

    set_canvas_sizes(width, height) {
        this.game_canvas.width = width;
        this.game_canvas.height = height;
        this.cursor_canvas.width = width;
        this.cursor_canvas.height = height;
    }
}

window.RenderingSystem = RenderingSystem;