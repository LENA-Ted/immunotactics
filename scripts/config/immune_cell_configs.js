const IMMUNE_CELL_CONFIGS = {
    B_CELL: {
        cost: 40,
        base_hp: 10,
        shoot_hp_cost: 1,
        shoot_interval_ms: 2000,
        radius: 15,
        color: '#4A90E2',
        stroke_color: '#ffffff',
        stroke_width: 2,
        range: null,
        projectile_count: 1,
        projectile_damage: 10,
        projectile_speed: 8
    },
    MAST_CELL: {
        cost: 40,
        base_hp: 10,
        shoot_hp_cost: 1,
        shoot_interval_ms: 1000,
        radius: 15,
        color: '#E94B3C',
        stroke_color: '#ffffff',
        stroke_width: 2,
        range_factor: 1/3,
        projectile_count: 5,
        projectile_damage: 4,
        projectile_speed: 8,
        cone_angle_degrees: 45
    },
    INTERFERON: {
        cost: 40,
        base_hp: 10,
        action_hp_cost: 1,
        action_interval_ms: 3000,
        radius: 15,
        color: '#50C878',
        stroke_color: '#ffffff',
        stroke_width: 2,
        range_factor: 2/3,
        interfered_duration_ms: 3000
    }
};

const IMMUNE_CELL_TYPES = {
    B_CELL: 'B_CELL',
    MAST_CELL: 'MAST_CELL',
    INTERFERON: 'INTERFERON'
};

const IMMUNE_CELL_NAMES = {
    B_CELL: 'B-Cell',
    MAST_CELL: 'Mast Cell',
    INTERFERON: 'Interferon'
};

window.IMMUNE_CELL_CONFIGS = IMMUNE_CELL_CONFIGS;
window.IMMUNE_CELL_TYPES = IMMUNE_CELL_TYPES;
window.IMMUNE_CELL_NAMES = IMMUNE_CELL_NAMES;