const ENEMY_CONFIGS = {
    BASIC: {
        min_hp: 10,
        max_hp: 20,
        min_speed: 0.5,
        max_speed: 1.0,
        min_size_mod: 0.5,
        max_size_mod: 1.5,
        base_radius: 10,
        stroke_color: '#000000',
        stroke_width: 2
    }
};

const ENEMY_SPAWN_CONFIG = {
    base_spawn_chance: 0.25,
    spawn_chance_increment: 0.05,
    spawn_interval_ms: 1000
};

const ENEMY_TYPES = {
    BASIC: 'BASIC'
};

window.ENEMY_CONFIGS = ENEMY_CONFIGS;
window.ENEMY_SPAWN_CONFIG = ENEMY_SPAWN_CONFIG;
window.ENEMY_TYPES = ENEMY_TYPES;