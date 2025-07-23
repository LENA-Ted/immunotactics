class PhenotypeSystem {
    constructor() {
        this.active_phenotype = null;
        this.phenotype_level = 0;
        this.error_timer = 0;
        this.error_blink_duration = 30;
        this.glow_timer = 0;
    }

    initialize() {
        this.set_active_phenotype(PHENOTYPE_CONFIG.DEFAULT_PHENOTYPE);
        this.reset();
    }

    reset() {
        this.phenotype_level = 0;
        this.error_timer = 0;
        this.glow_timer = 0;
        
        if (this.active_phenotype) {
            this.active_phenotype.reset();
        }
    }

    set_active_phenotype(phenotype_type) {
        switch (phenotype_type) {
            case PHENOTYPE_TYPES.PERFORIN_PULSE:
                this.active_phenotype = new PerforinPulse();
                break;
            default:
                console.error(`Unknown phenotype type: ${phenotype_type}`);
                this.active_phenotype = new PerforinPulse();
                break;
        }
    }

    update(timestamp) {
        if (this.active_phenotype) {
            this.active_phenotype.update(timestamp);
        }
        
        this.update_error_timer();
        this.update_glow_timer();
    }

    update_error_timer() {
        if (this.error_timer > 0) {
            this.error_timer--;
        }
    }

    update_glow_timer() {
        this.glow_timer = (this.glow_timer + 1) % (PHENOTYPE_CONFIG.GLOW_CYCLE_DURATION_MS / 16);
    }

    perform_action(cursor_x, cursor_y) {
        if (!this.active_phenotype) {
            return false;
        }

        if (!window.game_state || !window.game_state.core) {
            return false;
        }

        const timestamp = performance.now();
        const core_x = window.game_state.core.x;
        const core_y = window.game_state.core.y;

        if (this.active_phenotype.can_perform_action(timestamp)) {
            return this.active_phenotype.perform_action(timestamp, cursor_x, cursor_y, core_x, core_y);
        } else {
            this.trigger_cooldown_error();
            return false;
        }
    }

    trigger_cooldown_error() {
        this.error_timer = this.error_blink_duration;
    }

    is_error_active() {
        return this.error_timer > 0 && Math.floor(this.error_timer / 5) % 2 === 0;
    }

    get_active_phenotype() {
        return this.active_phenotype;
    }

    get_phenotype_level() {
        return this.phenotype_level;
    }

    set_phenotype_level(level) {
        this.phenotype_level = Math.max(0, level);
    }

    increase_phenotype_level(amount = 1) {
        this.phenotype_level += amount;
    }

    get_cooldown_progress() {
        if (!this.active_phenotype) {
            return 1.0;
        }
        
        return this.active_phenotype.get_cooldown_progress();
    }

    is_action_ready() {
        if (!this.active_phenotype) {
            return false;
        }
        
        return this.active_phenotype.is_action_ready();
    }

    get_gauge_color() {
        if (!this.active_phenotype) {
            return '#FFFF99';
        }
        
        return this.active_phenotype.get_gauge_color();
    }

    get_gauge_color_light() {
        if (!this.active_phenotype) {
            return '#FFFFCC';
        }
        
        return this.active_phenotype.get_gauge_color_light();
    }

    get_glow_intensity() {
        const cycle_progress = this.glow_timer / (PHENOTYPE_CONFIG.GLOW_CYCLE_DURATION_MS / 16);
        return 0.5 + 0.5 * Math.sin(cycle_progress * Math.PI * 2);
    }

    get_current_gauge_color() {
        if (this.is_error_active()) {
            return GAME_CONFIG.COLOR_INSUFFICIENT_ENERGY;
        }
        
        const base_color = this.get_gauge_color();
        const light_color = this.get_gauge_color_light();
        const glow_intensity = this.get_glow_intensity();
        
        return this.interpolate_color(base_color, light_color, glow_intensity);
    }

    interpolate_color(color1, color2, factor) {
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);
        
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}

window.PhenotypeSystem = PhenotypeSystem;