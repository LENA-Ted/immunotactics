class BiofilmSystem {
    constructor() {
        this.spawn_chance = BIOFILM_CONFIG.INITIAL_SPAWN_CHANCE;
        this.last_spawn_attempt_time = 0;
        this.currently_hovered_biofilm = null;
    }

    reset() {
        this.spawn_chance = BIOFILM_CONFIG.INITIAL_SPAWN_CHANCE;
        this.last_spawn_attempt_time = 0;
        this.currently_hovered_biofilm = null;
    }

    update(cursor_x, cursor_y, current_time) {
        if (!window.game_state) {
            return;
        }

        this.attempt_biofilm_spawn(current_time);
        this.update_existing_biofilms();
        this.handle_cursor_interactions(cursor_x, cursor_y);
        this.clean_up_completed_biofilms();
    }

    attempt_biofilm_spawn(current_time) {
        if (!this.should_attempt_spawn(current_time)) {
            return;
        }

        this.last_spawn_attempt_time = current_time;

        if (Math.random() < this.spawn_chance) {
            this.spawn_biofilm();
            this.reset_spawn_chance();
        } else {
            this.increase_spawn_chance();
        }
    }

    should_attempt_spawn(current_time) {
        if (!window.game_state || !window.game_state.get_adjusted_elapsed_time) {
            return current_time - this.last_spawn_attempt_time >= BIOFILM_CONFIG.SPAWN_INTERVAL_MS;
        }

        const adjusted_elapsed = window.game_state.get_adjusted_elapsed_time(this.last_spawn_attempt_time);
        return adjusted_elapsed >= BIOFILM_CONFIG.SPAWN_INTERVAL_MS;
    }

    spawn_biofilm() {
        const spawn_position = this.find_valid_spawn_position();
        
        if (!spawn_position) {
            return false;
        }

        const biofilm = new Biofilm(spawn_position.x, spawn_position.y);
        
        if (!window.game_state.biofilms) {
            window.game_state.biofilms = [];
        }
        
        window.game_state.biofilms.push(biofilm);
        return true;
    }

    find_valid_spawn_position() {
        const max_attempts = 50;
        
        for (let attempt = 0; attempt < max_attempts; attempt++) {
            const position = this.generate_random_position();
            
            if (this.is_valid_spawn_position(position)) {
                return position;
            }
        }
        
        return null;
    }

    generate_random_position() {
        const canvas_width = window.game_state ? window.game_state.canvas_width : 800;
        const canvas_height = window.game_state ? window.game_state.canvas_height : 600;
        
        const temp_biofilm_radius = BIOFILM_CONFIG.BASE_RADIUS * BIOFILM_CONFIG.MAX_SIZE_MODIFIER;
        const safe_distance = temp_biofilm_radius * BIOFILM_CONFIG.BORDER_SAFETY_MULTIPLIER;
        
        const x = MathUtils.get_random_float(safe_distance, canvas_width - safe_distance);
        const y = MathUtils.get_random_float(safe_distance, canvas_height - safe_distance);
        
        return { x, y };
    }

    is_valid_spawn_position(position) {
        return this.is_position_clear_of_towers(position) && 
               this.is_position_clear_of_core(position);
    }

    is_position_clear_of_towers(position) {
        if (!window.game_state || !window.game_state.towers) {
            return true;
        }

        const temp_biofilm_radius = BIOFILM_CONFIG.BASE_RADIUS * BIOFILM_CONFIG.MAX_SIZE_MODIFIER;
        
        return !window.game_state.towers.some(tower => {
            const distance = MathUtils.get_distance(position.x, position.y, tower.x, tower.y);
            return distance < temp_biofilm_radius + tower.radius;
        });
    }

    is_position_clear_of_core(position) {
        if (!window.game_state || !window.game_state.core) {
            return true;
        }

        const core = window.game_state.core;
        const temp_biofilm_radius = BIOFILM_CONFIG.BASE_RADIUS * BIOFILM_CONFIG.MAX_SIZE_MODIFIER;
        const distance = MathUtils.get_distance(position.x, position.y, core.x, core.y);
        
        return distance >= temp_biofilm_radius + core.radius;
    }

    reset_spawn_chance() {
        this.spawn_chance = BIOFILM_CONFIG.INITIAL_SPAWN_CHANCE;
    }

    increase_spawn_chance() {
        this.spawn_chance += BIOFILM_CONFIG.SPAWN_CHANCE_INCREMENT;
        this.spawn_chance = Math.min(this.spawn_chance, 1.0);
    }

    update_existing_biofilms() {
        if (!window.game_state || !window.game_state.biofilms) {
            return;
        }

        window.game_state.biofilms.forEach(biofilm => {
            biofilm.update();
        });
    }

    handle_cursor_interactions(cursor_x, cursor_y) {
        if (!window.game_state || !window.game_state.biofilms) {
            return;
        }

        const hovered_biofilm = this.find_hovered_biofilm(cursor_x, cursor_y);

        if (hovered_biofilm !== this.currently_hovered_biofilm) {
            if (this.currently_hovered_biofilm) {
                this.currently_hovered_biofilm.stop_harvesting();
            }

            this.currently_hovered_biofilm = hovered_biofilm;

            if (this.currently_hovered_biofilm) {
                this.currently_hovered_biofilm.start_harvesting();
            }
        }
    }

    find_hovered_biofilm(cursor_x, cursor_y) {
        if (!window.game_state || !window.game_state.biofilms) {
            return null;
        }

        return window.game_state.biofilms.find(biofilm => {
            return !biofilm.should_be_removed() && biofilm.is_cursor_hovering(cursor_x, cursor_y);
        }) || null;
    }

    clean_up_completed_biofilms() {
        if (!window.game_state || !window.game_state.biofilms) {
            return;
        }

        const biofilms_to_remove = [];

        for (let i = window.game_state.biofilms.length - 1; i >= 0; i--) {
            const biofilm = window.game_state.biofilms[i];

            if (biofilm.should_be_removed()) {
                if (biofilm.is_completed) {
                    biofilm.generate_resource_particles();
                }

                if (biofilm === this.currently_hovered_biofilm) {
                    this.currently_hovered_biofilm = null;
                }

                window.game_state.biofilms.splice(i, 1);
            }
        }
    }

    get_current_spawn_chance() {
        return this.spawn_chance;
    }

    get_biofilm_count() {
        if (!window.game_state || !window.game_state.biofilms) {
            return 0;
        }
        return window.game_state.biofilms.length;
    }

    is_harvesting_biofilm() {
        return this.currently_hovered_biofilm !== null;
    }

    get_currently_hovered_biofilm() {
        return this.currently_hovered_biofilm;
    }
}

window.BiofilmSystem = BiofilmSystem;