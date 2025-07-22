class PhenotypeSystem {
    constructor() {
        this.active_phenotype = null;
        this.phenotype_level = 0;
        this.error_timer = 0;
        this.error_blink_duration = 30;
        this.gauge_opacity = 0.0;
        this.opacity_transition_speed = 0.1;
    }

    initialize() {
        this.set_active_phenotype(PHENOTYPE_CONFIG.DEFAULT_PHENOTYPE);
        this.reset();
    }

    reset() {
        this.phenotype_level = 0;
        this.error_timer = 0;
        this.gauge_opacity = 0.0;
        
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
        this.update_gauge_opacity();
    }

    update_error_timer() {
        if (this.error_timer > 0) {
            this.error_timer--;
        }
    }

    update_gauge_opacity() {
        const target_opacity = this.should_show_gauge() ? 1.0 : 0.0;
        this.gauge_opacity = MathUtils.lerp(this.gauge_opacity, target_opacity, this.opacity_transition_speed);
    }

    should_show_gauge() {
        return !this.is_action_ready();
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

    get_current_gauge_color() {
        if (this.is_error_active()) {
            return GAME_CONFIG.COLOR_INSUFFICIENT_ENERGY;
        }
        
        return this.get_gauge_color();
    }

    get_gauge_opacity() {
        return this.gauge_opacity;
    }

    should_render_gauge() {
        return this.gauge_opacity > 0.01;
    }
}

window.PhenotypeSystem = PhenotypeSystem;