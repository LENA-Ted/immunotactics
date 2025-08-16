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

window.PATHOGEN_CONFIGS = PATHOGEN_CONFIGS;
window.PATHOGEN_TYPES = PATHOGEN_TYPES;
window.PATHOGEN_POOL = PATHOGEN_POOL;