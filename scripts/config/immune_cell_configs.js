const IMMUNE_CELL_CONFIGS = {
    B_CELL: {
        cost: 25,
        base_hp: 15,
        shoot_hp_cost: 1,
        shoot_interval_ms: 2000,
        radius: 15,
        color: '#4A90E2',
        stroke_color: '#ffffff',
        stroke_width: 2,
        range: null,
        projectile_count: 1,
        projectile_damage: 12,
        projectile_speed: 8,
        collision_behavior: 'DESTROY_ON_CONTACT',
        targeting_behavior: 'DIRECTIONAL',
        icon_path: null
    },
    MAST_CELL: {
        cost: 25,
        base_hp: 15,
        shoot_hp_cost: 1,
        shoot_interval_ms: 1000,
        radius: 15,
        color: '#E94B3C',
        stroke_color: '#ffffff',
        stroke_width: 2,
        range_factor: 1/3,
        projectile_count: 5,
        projectile_damage: 5,
        projectile_speed: 8,
        cone_angle_degrees: 45,
        collision_behavior: 'DESTROY_ON_CONTACT',
        targeting_behavior: 'DIRECTIONAL',
        icon_path: null
    },
    INTERFERON: {
        cost: 25,
        base_hp: 15,
        action_hp_cost: 1,
        action_interval_ms: 3000,
        radius: 15,
        color: '#50C878',
        stroke_color: '#ffffff',
        stroke_width: 2,
        range_factor: 2/3,
        interfered_duration_ms: 3000,
        collision_behavior: 'DESTROY_ON_CONTACT',
        targeting_behavior: 'NON_DIRECTIONAL',
        icon_path: null
    },
    NEUTROPHIL: {
        cost: 25,
        base_hp: 1,
        radius: 15,
        color: '#FF69B4',
        stroke_color: '#ffffff',
        stroke_width: 2,
        base_damage: 100,
        explosion_radius: 300,
        countdown_duration_ms: 2000,
        collision_behavior: 'DESTROY_ON_CONTACT',
        targeting_behavior: 'NON_DIRECTIONAL',
        icon_path: null
    }
};

const IMMUNE_CELL_TYPES = {
    B_CELL: 'B_CELL',
    MAST_CELL: 'MAST_CELL',
    INTERFERON: 'INTERFERON',
    NEUTROPHIL: 'NEUTROPHIL'
};

const IMMUNE_CELL_NAMES = {
    B_CELL: 'B-Cell',
    MAST_CELL: 'Mast Cell',
    INTERFERON: 'Interferon',
    NEUTROPHIL: 'Neutrophil'
};

const IMMUNE_CELL_DESCRIPTIONS = {
    B_CELL: 'Shoots at the closest enemy. Has unlimited range.',
    MAST_CELL: 'Shoots a spread at the closest enemy. Has short range.',
    INTERFERON: 'Projects an AoE ray that slows down enemies. Has medium range.',
    NEUTROPHIL: 'Explodes after a short wait. Deals large damage.'
};

const COLLISION_BEHAVIORS = {
    DESTROY_ON_CONTACT: 'DESTROY_ON_CONTACT',
    ACTIVATE_ON_CONTACT: 'ACTIVATE_ON_CONTACT'
};

const TARGETING_BEHAVIORS = {
    DIRECTIONAL: 'DIRECTIONAL',
    NON_DIRECTIONAL: 'NON_DIRECTIONAL'
};

window.IMMUNE_CELL_CONFIGS = IMMUNE_CELL_CONFIGS;
window.IMMUNE_CELL_TYPES = IMMUNE_CELL_TYPES;
window.IMMUNE_CELL_NAMES = IMMUNE_CELL_NAMES;
window.IMMUNE_CELL_DESCRIPTIONS = IMMUNE_CELL_DESCRIPTIONS;
window.COLLISION_BEHAVIORS = COLLISION_BEHAVIORS;
window.TARGETING_BEHAVIORS = TARGETING_BEHAVIORS;