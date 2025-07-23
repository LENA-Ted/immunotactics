class PhenotypeSystem {
    constructor() {
        this.active_phenotype = null;
        this.phenotype_level = PHENOTYPE_GAMEPLAY_CONFIG.DEFAULT_PHENOTYPE_LEVEL;
        this.available_phenotypes = new Map();
        this.error_blink_timer = 0;
        this.cooldown_gauge_opacity = 0;
        this.target_cooldown_gauge_opacity = 0;
        
        this.register_default_phenotypes();
        this.set_default_phenotype();
    }

    register_default_phenotypes() {
        this.register_phenotype(PHENOTYPE_TYPES.PERFORIN_PULSE, PerforinPulse);
    }

    register_phenotype(phenotype_type, phenotype_class) {
        if (!PHENOTYPE_CONFIGS[phenotype_type]) {
            console.error(`Phenotype config not found for type: ${phenotype_type}`);
            return false;
        }

        this.available_phenotypes.set(phenotype_type, phenotype_class);
        return true;
    }

    set_default_phenotype() {
        this.equip_phenotype(PHENOTYPE_TYPES.PERFORIN_PULSE);
    }

    equip_phenotype(phenotype_type) {
        if (!this.available_phenotypes.has(phenotype_type)) {
            console.error(`Unknown phenotype type: ${phenotype_type}`);
            return false;
        }

        const phenotype_class = this.available_phenotypes.get(phenotype_type);
        this.active_phenotype = new phenotype_class();
        return true;
    }

    attempt_activation(cursor_x, cursor_y, current_time) {
        if (!this.active_phenotype) {
            return false;
        }

        const activation_successful = this.active_phenotype.activate(
            cursor_x, 
            cursor_y, 
            this.phenotype_level, 
            current_time
        );

        if (!activation_successful) {
            this.trigger_error_blink();
        }

        return activation_successful;
    }

    trigger_error_blink() {
        this.error_blink_timer = PHENOTYPE_UI_CONFIG.ERROR_BLINK_DURATION_FRAMES;
    }

    update(current_time) {
        if (this.active_phenotype) {
            this.active_phenotype.update_cooldown(current_time);
        }

        this.update_error_blink();
        this.update_cooldown_gauge_opacity(current_time);
    }

    update_error_blink() {
        if (this.error_blink_timer > 0) {
            this.error_blink_timer--;
        }
    }

    update_cooldown_gauge_opacity(current_time) {
        if (!this.active_phenotype) {
            this.target_cooldown_gauge_opacity = 0;
        } else if (this.active_phenotype.can_activate(current_time)) {
            this.target_cooldown_gauge_opacity = 0;
        } else {
            this.target_cooldown_gauge_opacity = 1;
        }

        this.cooldown_gauge_opacity = MathUtils.lerp(
            this.cooldown_gauge_opacity,
            this.target_cooldown_gauge_opacity,
            PHENOTYPE_UI_CONFIG.FADE_TRANSITION_SPEED
        );
    }

    get_active_phenotype() {
        return this.active_phenotype;
    }

    get_phenotype_level() {
        return this.phenotype_level;
    }

    increase_phenotype_level(amount = 1) {
        this.phenotype_level = Math.min(
            this.phenotype_level + amount,
            PHENOTYPE_GAMEPLAY_CONFIG.MAX_PHENOTYPE_LEVEL
        );
    }

    get_cooldown_progress(current_time) {
        if (!this.active_phenotype) {
            return 1.0;
        }

        return this.active_phenotype.get_cooldown_progress(current_time);
    }

    get_cooldown_gauge_opacity() {
        return this.cooldown_gauge_opacity;
    }

    is_error_blink_active() {
        if (this.error_blink_timer <= 0) {
            return false;
        }

        const blink_cycle = Math.floor(this.error_blink_timer / PHENOTYPE_UI_CONFIG.ERROR_BLINK_INTERVAL_FRAMES);
        return blink_cycle % 2 === 0;
    }

    is_on_cooldown(current_time) {
        if (!this.active_phenotype) {
            return false;
        }

        return this.active_phenotype.is_on_cooldown(current_time);
    }

    reset() {
        this.phenotype_level = PHENOTYPE_GAMEPLAY_CONFIG.DEFAULT_PHENOTYPE_LEVEL;
        this.error_blink_timer = 0;
        this.cooldown_gauge_opacity = 0;
        this.target_cooldown_gauge_opacity = 0;
        
        if (this.active_phenotype) {
            this.active_phenotype.last_activation_time = 0;
            this.active_phenotype.cooldown_remaining_ms = 0;
        }
    }
}

window.PhenotypeSystem = PhenotypeSystem;