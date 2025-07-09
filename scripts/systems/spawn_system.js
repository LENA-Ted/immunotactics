class SpawnSystem {
    constructor(enemy_factory, canvas_width, canvas_height) {
        this.enemy_factory = enemy_factory;
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
        this.spawn_chance = ENEMY_SPAWN_CONFIG.base_spawn_chance;
        this.spawn_timer_handle = null;
        this.is_running = false;
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
    }

    attempt_spawn() {
        if (!window.game_state || window.game_state.is_game_over || window.game_state.is_game_paused) {
            return;
        }

        const modified_spawn_chance = this.get_intensity_modified_spawn_chance();

        if (Math.random() < modified_spawn_chance) {
            const spawn_group_number = this.get_spawn_group_number();
            
            for (let i = 0; i < spawn_group_number; i++) {
                this.spawn_enemy();
            }
            
            this.reset_spawn_chance();
        } else {
            this.increase_spawn_chance();
        }
    }

    get_spawn_group_number() {
        const intensity_level = window.game_state ? window.game_state.intensity_level : 0;
        return 1 + Math.floor(intensity_level / INTENSITY_CONFIG.SPAWN_GROUP_LEVEL_INTERVAL);
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