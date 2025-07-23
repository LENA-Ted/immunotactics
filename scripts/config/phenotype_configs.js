const PHENOTYPE_CONFIGS = {
    PERFORIN_PULSE: {
        name: 'Perforin Pulse',
        base_damage: 10,
        damage_per_level: 2,
        cytokine_damage_factor: 0.005,
        cooldown_ms: 1000,
        gauge_color: '#FFFF99',
        gauge_color_light: '#FFFFCC',
        projectile_speed: 8,
        projectile_radius: 4,
        range: null
    }
};

const PHENOTYPE_TYPES = {
    PERFORIN_PULSE: 'PERFORIN_PULSE'
};

const PHENOTYPE_CONFIG = {
    DEFAULT_PHENOTYPE: PHENOTYPE_TYPES.PERFORIN_PULSE,
    GAUGE_SPACING: 3,
    GAUGE_THICKNESS_RATIO: 0.5,
    GLOW_CYCLE_DURATION_MS: 500
};

window.PHENOTYPE_CONFIGS = PHENOTYPE_CONFIGS;
window.PHENOTYPE_TYPES = PHENOTYPE_TYPES;
window.PHENOTYPE_CONFIG = PHENOTYPE_CONFIG;