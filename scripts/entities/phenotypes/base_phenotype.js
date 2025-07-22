class BasePhenotype {
    constructor(phenotype_type) {
        this.type = phenotype_type;
        this.config = PHENOTYPE_CONFIGS[phenotype_type];
        this.last_action_time = 0;
        this.is_in_cooldown = false;
        
        if (!this.config) {
            console.error(`Unknown phenotype type: ${phenotype_type}`);
        }
    }

    can_perform_action(timestamp) {
        if (!this.config) {
            return false;
        }
        
        const elapsed_time = timestamp - this.last_action_time;
        return elapsed_time >= this.config.cooldown_ms;
    }

    perform_action(timestamp, cursor_x, cursor_y, core_x, core_y) {
        if (!this.can_perform_action(timestamp)) {
            return false;
        }
        
        this.last_action_time = timestamp;
        this.is_in_cooldown = true;
        
        this.execute_action(cursor_x, cursor_y, core_x, core_y);
        return true;
    }

    execute_action(cursor_x, cursor_y, core_x, core_y) {
        
    }

    update(timestamp) {
        if (this.is_in_cooldown && this.can_perform_action(timestamp)) {
            this.is_in_cooldown = false;
        }
    }

    get_cooldown_progress() {
        if (!this.config || !this.is_in_cooldown) {
            return 1.0;
        }
        
        let elapsed_time;
        if (window.game_state && window.game_state.get_adjusted_elapsed_time) {
            elapsed_time = window.game_state.get_adjusted_elapsed_time(this.last_action_time);
        } else {
            elapsed_time = performance.now() - this.last_action_time;
        }
        
        const progress = elapsed_time / this.config.cooldown_ms;
        return Math.min(progress, 1.0);
    }

    is_action_ready() {
        return !this.is_in_cooldown;
    }

    get_name() {
        return this.config ? this.config.name : 'Unknown Phenotype';
    }

    get_gauge_color() {
        return this.config ? this.config.gauge_color : '#FFFF99';
    }

    get_gauge_color_light() {
        return this.config ? this.config.gauge_color_light : '#FFFFCC';
    }

    reset() {
        this.last_action_time = 0;
        this.is_in_cooldown = false;
    }
}

window.BasePhenotype = BasePhenotype;