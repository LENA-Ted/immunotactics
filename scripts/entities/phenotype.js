class BasePhenotype {
    constructor(phenotype_type) {
        this.type = phenotype_type;
        this.config = PHENOTYPE_CONFIGS[phenotype_type];
        this.last_activation_time = 0;
        this.cooldown_remaining_ms = 0;
        
        if (!this.config) {
            console.error(`Unknown phenotype type: ${phenotype_type}`);
        }
    }

    get_name() {
        return this.config ? this.config.name : 'Unknown Phenotype';
    }

    get_cooldown_ms() {
        return this.config ? this.config.base_cooldown_ms : 1000;
    }

    get_gauge_color_primary() {
        return this.config ? this.config.gauge_color_primary : '#FFE135';
    }

    get_gauge_color_secondary() {
        return this.config ? this.config.gauge_color_secondary : '#FFF176';
    }

    can_activate(current_time) {
        if (!this.config) {
            return false;
        }

        const elapsed_since_activation = current_time - this.last_activation_time;
        return elapsed_since_activation >= this.get_cooldown_ms();
    }

    get_cooldown_progress(current_time) {
        if (!this.config) {
            return 1.0;
        }

        const elapsed_since_activation = current_time - this.last_activation_time;
        const cooldown_ms = this.get_cooldown_ms();
        
        if (elapsed_since_activation >= cooldown_ms) {
            return 1.0;
        }
        
        return elapsed_since_activation / cooldown_ms;
    }

    update_cooldown(current_time) {
        const elapsed_since_activation = current_time - this.last_activation_time;
        const cooldown_ms = this.get_cooldown_ms();
        
        if (elapsed_since_activation < cooldown_ms) {
            this.cooldown_remaining_ms = cooldown_ms - elapsed_since_activation;
        } else {
            this.cooldown_remaining_ms = 0;
        }
    }

    activate(cursor_x, cursor_y, phenotype_level, current_time) {
        if (!this.can_activate(current_time)) {
            return false;
        }

        this.last_activation_time = current_time;
        this.perform_action(cursor_x, cursor_y, phenotype_level);
        return true;
    }

    perform_action(cursor_x, cursor_y, phenotype_level) {
        
    }

    calculate_base_damage(phenotype_level) {
        if (!this.config) {
            return 0;
        }

        return this.config.base_damage + (this.config.damage_per_level * phenotype_level);
    }

    calculate_cytokine_damage_bonus(base_damage) {
        if (!window.game_state || !window.game_state.resource_system) {
            return 0;
        }

        const cytokines = window.game_state.resource_system.get_cytokines();
        const bonus_multiplier = cytokines * PHENOTYPE_GAMEPLAY_CONFIG.CYTOKINE_DAMAGE_PERCENT_PER_UNIT;
        return Math.ceil(base_damage * bonus_multiplier);
    }

    calculate_total_damage(phenotype_level) {
        const base_damage = this.calculate_base_damage(phenotype_level);
        const cytokine_bonus = this.calculate_cytokine_damage_bonus(base_damage);
        return base_damage + cytokine_bonus;
    }

    is_on_cooldown(current_time) {
        return !this.can_activate(current_time);
    }
}

window.BasePhenotype = BasePhenotype;