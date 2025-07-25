const GAME_CONFIG = {
    PROJECTILE_DAMAGE: 10,
    PROJECTILE_SPEED: 8,
    
    PLAYER_MAX_ENERGY: 100,
    ENERGY_REGEN_RATE: 1,
    ENERGY_REGEN_INTERVAL_MS: 100,
    
    CORE_START_HP: 3,
    CORE_MAX_HP: 3,
    
    PULSATE_DURATION_FRAMES: 15,
    PULSATE_MAGNITUDE: 0.2,
    
    SCREEN_SHAKE_MAGNITUDE: 8,
    SCREEN_SHAKE_DURATION_FRAMES: 20,
    
    COLOR_CREAM: '#F5F5DC',
    COLOR_DARK_BLUE: '#2c3e50',
    COLOR_ENEMY_HP: '#FF6B6B',
    COLOR_INSUFFICIENT_ENERGY: '#E74C3C',
    COLOR_INTENSITY_GAUGE: '#F5F5DC',
    COLOR_INTENSITY_PROGRESS: '#2c3e50',
    COLOR_FREE_PLACEMENT: '#DDD6FE',
    
    RESOURCE_UI_POSITION_X: 20,
    RESOURCE_UI_POSITION_Y: 20,
    RESOURCE_UI_SPACING: 10,
    RESOURCE_UI_SYMBOL_VALUE_GAP: 8,
    
    DIAGONAL_STRIPES_OPACITY: 0.05,
    DIAGONAL_STRIPES_THICKNESS_PX: 30,
    DIAGONAL_STRIPES_SPACING_PX: 30,
    DIAGONAL_STRIPES_ANIMATION_DURATION_S: 2,
    
    FROSTED_GLASS_BLUR_PX: 6,
    
    CUBIC_BEZIER_EASE_OUT_P1: 0.25,
    CUBIC_BEZIER_EASE_OUT_P2: 0.46,
    CUBIC_BEZIER_EASE_OUT_P3: 0.45,
    CUBIC_BEZIER_EASE_OUT_P4: 0.94,
    
    GAUGE_ANIMATION_BASE_SPEED: 0.02,
    GAUGE_ANIMATION_DISTANCE_MULTIPLIER: 0.15,
    
    ENEMY_HP_GAUGE_ANIMATION_SPEED: 0.001,
    ENEMY_HP_GAUGE_EASING_STRENGTH: 0.025
};

window.GAME_CONFIG = GAME_CONFIG;