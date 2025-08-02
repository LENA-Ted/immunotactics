class SpawnSystem {
    constructor(enemy_factory, canvas_width, canvas_height) {
        this.enemy_factory = enemy_factory;
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
        this.spawn_chance = ENEMY_SPAWN_CONFIG.base_spawn_chance;
        this.spawn_timer_handle = null;
        this.is_running = false;
        this.is_spawn_cooldown_active = false;
    }

    start() {
        if (this.is_running) {
            return;
        }

        this.is_running = true;
        this.spawn_timer_handle = setInterval(() => {
            this.attempt_spawn();
        }, ENEMY_SPAWN_CONFIG.spawn_interval_ms);
    }

    stop() {
        if (!this.is_running) {
            return;
        }

        this.is_running = false;
        if (this.spawn_timer_handle) {
            clearInterval(this.spawn_timer_handle);
            this.spawn_timer_handle = null;
        }
    }

    reset() {
        this.spawn_chance = ENEMY_SPAWN_CONFIG.base_spawn_chance;
        this.is_spawn_cooldown_active = false;
    }

    attempt_spawn() {
        if (!window.game_state || window.game_state.is_game_over || window.game_state.is_game_paused) {
            return;
        }

        const modified_spawn_chance = this.get_intensity_modified_spawn_chance();

        if (Math.random() < modified_spawn_chance) {
            let spawn_count;
            const intensity_level = window.game_state.intensity_level || 0;
            const is_cooldown_disabled = intensity_level > INTENSITY_CONFIG.SPAWN_COOLDOWN_DISABLE_LEVEL;
            
            if (!is_cooldown_disabled && this.is_spawn_cooldown_active) {
                spawn_count = 1;
                this.is_spawn_cooldown_active = false;
            } else {
                spawn_count = this.get_random_spawn_count();
                if (!is_cooldown_disabled && spawn_count > 1) {
                    this.is_spawn_cooldown_active = true;
                }
            }
            
            for (let i = 0; i < spawn_count; i++) {
                this.spawn_enemy_by_category();
            }
            
            this.reset_spawn_chance();
        } else {
            this.increase_spawn_chance();
        }
    }

    spawn_enemy_by_category() {
        const pathogen_system = this.get_pathogen_system();
        
        if (!pathogen_system) {
            this.spawn_microbe();
            return;
        }

        if (pathogen_system.should_spawn_microbe()) {
            this.spawn_microbe();
        } else {
            this.spawn_pathogen();
        }
    }

    get_pathogen_system() {
        return window.game_state && window.game_state.pathogen_system ? window.game_state.pathogen_system : null;
    }

    spawn_microbe() {
        const enemy = this.enemy_factory.spawn_microbe_at_random_edge(
            this.canvas_width,
            this.canvas_height
        );

        if (enemy && window.game_state && window.game_state.enemies) {
            window.game_state.enemies.push(enemy);
            this.play_spawn_sound();
        }

        return enemy;
    }

    spawn_pathogen() {
        const pathogen_system = this.get_pathogen_system();
        
        if (!pathogen_system) {
            this.spawn_microbe();
            return;
        }

        const pathogen_type = pathogen_system.get_random_active_pathogen_type();
        
        if (!pathogen_type) {
            this.spawn_microbe();
            return;
        }

        const enemy = this.enemy_factory.spawn_pathogen_at_random_edge(
            this.canvas_width,
            this.canvas_height,
            pathogen_type
        );

        if (enemy && window.game_state && window.game_state.enemies) {
            window.game_state.enemies.push(enemy);
            this.play_spawn_sound();
        }

        return enemy;
    }

    play_spawn_sound() {
        if (window.game_state && window.game_state.audio_system) {
            window.game_state.audio_system.play_sound('SPAWN_ENEMY');
        }
    }

    get_spawn_group_number() {
        const intensity_level = window.game_state ? window.game_state.intensity_level : 0;
        return 1 + Math.floor(intensity_level / INTENSITY_CONFIG.SPAWN_GROUP_LEVEL_INTERVAL);
    }

    get_random_spawn_count() {
        const max_spawn_count = this.get_spawn_group_number();
        return MathUtils.get_random_int(1, max_spawn_count);
    }

    get_intensity_modified_spawn_chance() {
        const intensity_level = window.game_state ? window.game_state.intensity_level : 0;
        const intensity_modifier = intensity_level * INTENSITY_CONFIG.SPAWN_CHANCE_MODIFIER_PER_LEVEL;
        return this.spawn_chance + intensity_modifier;
    }

    spawn_enemy(enemy_type = ENEMY_TYPES.BASIC) {
        const enemy = this.enemy_factory.spawn_enemy_at_random_edge(
            this.canvas_width, 
            this.canvas_height, 
            enemy_type
        );

        if (enemy && window.game_state && window.game_state.enemies) {
            window.game_state.enemies.push(enemy);
            this.play_spawn_sound();
        }

        return enemy;
    }

    reset_spawn_chance() {
        this.spawn_chance = ENEMY_SPAWN_CONFIG.base_spawn_chance;
    }

    increase_spawn_chance() {
        this.spawn_chance += ENEMY_SPAWN_CONFIG.spawn_chance_increment;
        this.spawn_chance = MathUtils.clamp(this.spawn_chance, 0, 1);
    }

    update_canvas_size(width, height) {
        this.canvas_width = width;
        this.canvas_height = height;
    }

    get_current_spawn_chance() {
        return this.get_intensity_modified_spawn_chance();
    }

    is_spawn_system_running() {
        return this.is_running;
    }
}

window.SpawnSystem = SpawnSystem;