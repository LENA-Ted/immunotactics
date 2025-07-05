class GameLoop {
    constructor() {
        this.is_running = false;
        this.animation_frame_id = null;
        this.systems = {};
        this.game_state = null;
    }

    initialize(systems, initial_game_state) {
        this.systems = systems;
        this.game_state = initial_game_state;
        window.game_state = this.game_state;
    }

    start() {
        if (this.is_running) {
            return;
        }

        this.is_running = true;
        this.run_frame();
    }

    stop() {
        if (!this.is_running) {
            return;
        }

        this.is_running = false;
        if (this.animation_frame_id) {
            cancelAnimationFrame(this.animation_frame_id);
            this.animation_frame_id = null;
        }
    }

    run_frame() {
        if (!this.is_running) {
            return;
        }

        const timestamp = performance.now();
        
        this.update_game_state(timestamp);
        this.clean_up_entities();
        this.render_frame();

        if (!this.game_state.is_game_over) {
            this.animation_frame_id = requestAnimationFrame(() => {
                this.run_frame();
            });
        }
    }

    update_game_state(timestamp) {
        this.game_state.player.update(timestamp);

        if (this.systems.selection) {
            this.systems.selection.update(timestamp);
        }

        this.game_state.towers.forEach(tower => {
            tower.update(timestamp);
        });

        this.game_state.enemies.forEach(enemy => {
            enemy.update(this.game_state.core, timestamp);
        });

        this.game_state.projectiles.forEach(projectile => {
            projectile.update();
        });

        this.game_state.damage_numbers.forEach(damage_number => {
            damage_number.update();
        });

        this.game_state.effects.forEach(effect => {
            effect.update();
        });

        this.game_state.screen_shake.update();

        this.systems.collision.handle_all_collisions(this.game_state);

        this.systems.input.update_cursor_state(this.game_state.player);

        this.systems.ui.update_ui(this.game_state);
    }

    clean_up_entities() {
        this.game_state.towers = this.game_state.towers.filter(tower => {
            if (!tower.is_alive()) {
                if (this.game_state.last_tower_damage_time) {
                    delete this.game_state.last_tower_damage_time[tower.id];
                }
                return false;
            }
            return true;
        });

        this.game_state.damage_numbers = this.game_state.damage_numbers.filter(dn => 
            dn.is_alive()
        );

        this.game_state.effects = this.game_state.effects.filter(effect => 
            effect.is_alive()
        );

        this.game_state.projectiles = this.game_state.projectiles.filter(projectile => {
            if (projectile.is_out_of_bounds(
                this.systems.rendering.game_canvas.width, 
                this.systems.rendering.game_canvas.height
            )) {
                return false;
            }
            
            if (projectile.is_out_of_range && projectile.is_out_of_range()) {
                return false;
            }
            
            return true;
        });
    }

    render_frame() {
        const cursor_state = this.systems.input.get_cursor_state();
        this.systems.rendering.render_frame(this.game_state, cursor_state);
    }

    is_game_loop_running() {
        return this.is_running;
    }

    get_current_game_state() {
        return this.game_state;
    }
}

window.GameLoop = GameLoop;