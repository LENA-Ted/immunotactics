const PATHOGEN_CONFIGS = {
    MYCETOMA: {
        min_hp: 100,
        max_hp: 100,
        min_speed: 0.25,
        max_speed: 0.25,
        min_size_mod: 1.0,
        max_size_mod: 1.0,
        base_radius: 50,
        color: '#556B2F',
        stroke_color: '#000000',
        stroke_width: 2
    },
    RICKETTSIA: {
        min_hp: 40,
        max_hp: 40,
        min_speed: 0.5,
        max_speed: 0.5,
        min_size_mod: 1.0,
        max_size_mod: 1.0,
        base_radius: 20,
        color: '#FFA500',
        stroke_color: '#000000',
        stroke_width: 2,
        action_interval_ms: 2000,
        inoculation_range: 200
    },
    CLOSTRIDIUM: {
        min_hp: 60,
        max_hp: 60,
        min_speed: 0.75,
        max_speed: 0.75,
        min_size_mod: 1.0,
        max_size_mod: 1.0,
        base_radius: 15,
        color: '#8B4513',
        stroke_color: '#000000',
        stroke_width: 2,
        explosion_radius: 100
    },
    CANDIDA: {
        min_hp: 40,
        max_hp: 40,
        min_speed: 0.5,
        max_speed: 0.5,
        min_size_mod: 1.0,
        max_size_mod: 1.0,
        base_radius: 20,
        color: '#DDA0DD',
        stroke_color: '#000000',
        stroke_width: 2,
        aura_radius: 200,
        heal_interval_ms: 500,
        heal_percentage: 0.01
    },
    ADENOVIRUS: {
        min_hp: 40,
        max_hp: 40,
        min_speed: 0.5,
        max_speed: 0.5,
        min_size_mod: 1.0,
        max_size_mod: 1.0,
        base_radius: 15,
        color: '#FF6347',
        stroke_color: '#000000',
        stroke_width: 2,
        aura_radius: 200
    }
};

const PATHOGEN_TYPES = {
    MYCETOMA: 'MYCETOMA',
    RICKETTSIA: 'RICKETTSIA',
    CLOSTRIDIUM: 'CLOSTRIDIUM',
    CANDIDA: 'CANDIDA',
    ADENOVIRUS: 'ADENOVIRUS'
};

const PATHOGEN_POOL = [
    PATHOGEN_TYPES.MYCETOMA,
    PATHOGEN_TYPES.RICKETTSIA,
    PATHOGEN_TYPES.CLOSTRIDIUM,
    PATHOGEN_TYPES.CANDIDA,
    PATHOGEN_TYPES.ADENOVIRUS
];

const AURA_CONFIG = {
    FILLED_CIRCLE_OPACITY_MULTIPLIER: 0.15,
    CIRCLE_OUTLINE_OPACITY_MULTIPLIER: 0.6,
    AURA_PULSE_OPACITY_MAX: 0.3,
    AURA_PULSE_OPACITY_MIN: 0.1,
    AURA_PULSE_SPEED: 0.02,
    AURA_OUTLINE_LINE_WIDTH: 2
};

const STATUS_EFFECT_CONFIG = {
    IMMUNITY_FEEDBACK_DURATION_FRAMES: 60,
    PERMEATED_GRAY_COLOR: '#666666',
    PERMEATED_WHITE_OUTLINE: '#FFFFFF',
    PERMEATED_OUTLINE_WIDTH: 2
};

window.PATHOGEN_CONFIGS = PATHOGEN_CONFIGS;
window.PATHOGEN_TYPES = PATHOGEN_TYPES;
window.PATHOGEN_POOL = PATHOGEN_POOL;
window.AURA_CONFIG = AURA_CONFIG;
window.STATUS_EFFECT_CONFIG = STATUS_EFFECT_CONFIG;