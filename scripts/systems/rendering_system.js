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
        this.render_cursor(cursor_state, game_state.player);
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

    render_cursor(cursor_state, player) {
        const gauge_radius = 25;
        const energy_angle = (cursor_state.displayed_energy / player.max_energy) * Math.PI * 2;
        const is_error = cursor_state.error_timer > 0 && Math.floor(cursor_state.error_timer / 5) % 2 === 0;

        this.cursor_ctx.beginPath();
        this.cursor_ctx.arc(cursor_state.x, cursor_state.y, gauge_radius, 0, Math.PI * 2);
        this.cursor_ctx.strokeStyle = is_error ? 
            GAME_CONFIG.COLOR_INSUFFICIENT_ENERGY : 
            `${GAME_CONFIG.COLOR_DARK_BLUE}40`;
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
            this.cursor_ctx.strokeStyle = is_error ? 
                GAME_CONFIG.COLOR_INSUFFICIENT_ENERGY : 
                GAME_CONFIG.COLOR_CREAM;
            this.cursor_ctx.lineWidth = 8;
            this.cursor_ctx.lineCap = 'round';
            this.cursor_ctx.stroke();
        }
    }

    set_canvas_sizes(width, height) {
        this.game_canvas.width = width;
        this.game_canvas.height = height;
        this.cursor_canvas.width = width;
        this.cursor_canvas.height = height;
    }
}

window.RenderingSystem = RenderingSystem;