const PATHOGEN_CONFIGS = {
    COCCUS: {
        class: 'BACTERIA',
        min_hp: 10,
        max_hp: 30,
        min_speed: 0.5,
        max_speed: 1.0,
        min_size_mod: 0.5,
        max_size_mod: 1.5,
        base_radius: 10,
        stroke_color: '#000000',
        stroke_width: 2,
        shape: 'CIRCLE'
    },
    BACILLUS: {
        class: 'BACTERIA',
        min_hp: 10,
        max_hp: 30,
        min_speed: 0.5,
        max_speed: 1.0,
        min_size_mod: 0.5,
        max_size_mod: 1.5,
        base_radius: 10,
        stroke_color: '#000000',
        stroke_width: 2,
        shape: 'RECTANGLE',
        width_height_ratio: 2.0
    },
    MYCETOMA: {
        class: 'FUNGUS',
        min_hp: 200,
        max_hp: 600,
        min_speed: 0.15,
        max_speed: 0.15,
        min_size_mod: 1.0,
        max_size_mod: 1.0,
        base_radius: 60,
        stroke_color: '#000000',
        stroke_width: 2,
        shape: 'CIRCLE'
    },
    BACTERIOPHAGE: {
        class: 'VIRUS',
        min_hp: 100,
        max_hp: 300,
        min_speed: 0.5,
        max_speed: 0.5,
        min_size_mod: 1.0,
        max_size_mod: 1.5,
        base_radius: 10,
        stroke_color: '#000000',
        stroke_width: 2,
        shape: 'CIRCLE',
        suppression_radius_multiplier: 3.0
    },
    SPIRILLUM: {
        class: 'BACTERIA',
        min_hp: 20,
        max_hp: 60,
        min_speed: 0.75,
        max_speed: 0.75,
        min_size_mod: 1.0,
        max_size_mod: 1.0,
        base_radius: 10,
        stroke_color: '#000000',
        stroke_width: 2,
        shape: 'CIRCLE',
        targeting_distance: 500,
        targeting_duration_ms: 4000,
        rush_speed: 1.5
    }
};

const PATHOGEN_SPAWN_CONFIG = {
    standard_spawn_chance: 0.8,
    special_spawn_chance: 0.2,
    spawn_interval_ms: 1000
};

const PATHOGEN_TYPES = {
    COCCUS: 'COCCUS',
    BACILLUS: 'BACILLUS',
    MYCETOMA: 'MYCETOMA',
    BACTERIOPHAGE: 'BACTERIOPHAGE',
    SPIRILLUM: 'SPIRILLUM'
};

const PATHOGEN_CLASSES = {
    BACTERIA: 'BACTERIA',
    FUNGUS: 'FUNGUS',
    VIRUS: 'VIRUS'
};

const PATHOGEN_CATEGORIES = {
    STANDARD: [
        PATHOGEN_TYPES.COCCUS,
        PATHOGEN_TYPES.BACILLUS
    ],
    SPECIAL: [
        PATHOGEN_TYPES.MYCETOMA,
        PATHOGEN_TYPES.BACTERIOPHAGE,
        PATHOGEN_TYPES.SPIRILLUM
    ]
};

const PATHOGEN_SHAPES = {
    CIRCLE: 'CIRCLE',
    RECTANGLE: 'RECTANGLE'
};

window.PATHOGEN_CONFIGS = PATHOGEN_CONFIGS;
window.PATHOGEN_SPAWN_CONFIG = PATHOGEN_SPAWN_CONFIG;
window.PATHOGEN_TYPES = PATHOGEN_TYPES;
window.PATHOGEN_CLASSES = PATHOGEN_CLASSES;
window.PATHOGEN_CATEGORIES = PATHOGEN_CATEGORIES;
window.PATHOGEN_SHAPES = PATHOGEN_SHAPES;