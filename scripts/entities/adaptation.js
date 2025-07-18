class Adaptation {
    constructor(adaptation_type) {
        this.type = adaptation_type;
        this.level = 0;
        this.config = ADAPTATION_CONFIGS[adaptation_type];
        
        if (!this.config) {
            console.error(`Unknown adaptation type: ${adaptation_type}`);
        }
    }

    get_name() {
        return this.config ? this.config.name : 'Unknown Adaptation';
    }

    get_level() {
        return this.level;
    }

    get_display_level() {
        return this.level > 0 ? `+${this.level}` : '';
    }

    get_description() {
        if (!this.config || !this.config.descriptions) {
            return 'No description available.';
        }
        return this.config.descriptions[this.level] || 'No description available.';
    }

    get_effect() {
        if (!this.config || !this.config.effects) {
            return {};
        }
        return this.config.effects[this.level] || {};
    }

    can_level_up() {
        return this.level < ADAPTATION_CONFIG.MAX_LEVEL;
    }

    level_up() {
        if (this.can_level_up()) {
            this.level++;
            return true;
        }
        return false;
    }

    is_maxed() {
        return this.level >= ADAPTATION_CONFIG.MAX_LEVEL;
    }

    get_damage_multiplier() {
        const effect = this.get_effect();
        return effect.damage_multiplier || 1.0;
    }

    get_core_heal_per_intensity() {
        const effect = this.get_effect();
        return effect.core_heal_per_intensity || 0;
    }

    get_max_hp_increase() {
        const effect = this.get_effect();
        return effect.max_hp_increase || 0;
    }

    get_energy_refund_percent() {
        const effect = this.get_effect();
        return effect.energy_refund_percent || 0;
    }

    get_energy_cost_reduction() {
        const effect = this.get_effect();
        return effect.energy_cost_reduction || 0;
    }

    get_energy_regen_multiplier() {
        const effect = this.get_effect();
        return effect.energy_regen_multiplier || 1.0;
    }

    get_cytokine_double_chance() {
        const effect = this.get_effect();
        return effect.cytokine_double_chance || 0;
    }

    get_adjuvant_double_chance() {
        const effect = this.get_effect();
        return effect.adjuvant_double_chance || 0;
    }

    get_free_placement_chance() {
        const effect = this.get_effect();
        return effect.free_placement_chance || 0;
    }

    get_status_effect_duration_multiplier() {
        const effect = this.get_effect();
        return effect.status_effect_duration_multiplier || 1.0;
    }

    get_energy_per_kill() {
        const effect = this.get_effect();
        return effect.energy_per_kill || 0;
    }

    get_range_multiplier() {
        const effect = this.get_effect();
        return effect.range_multiplier || 1.0;
    }

    get_hp_per_ten_kills() {
        const effect = this.get_effect();
        return effect.hp_per_ten_kills || 0;
    }

    get_biomass_double_chance() {
        const effect = this.get_effect();
        return effect.biomass_double_chance || 0;
    }

    get_damage_per_core_hp_percent() {
        const effect = this.get_effect();
        return effect.damage_per_core_hp_percent || 0;
    }

    get_biomass_gain() {
        const effect = this.get_effect();
        return effect.biomass_gain || 0;
    }

    get_cytokine_gain() {
        const effect = this.get_effect();
        return effect.cytokine_gain || 0;
    }

    get_adjuvant_gain() {
        const effect = this.get_effect();
        return effect.adjuvant_gain || 0;
    }
}

window.Adaptation = Adaptation;