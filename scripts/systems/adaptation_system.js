class AdaptationSystem {
    constructor() {
        this.adaptations = new Map();
    }

    reset() {
        this.adaptations.clear();
    }

    has_adaptation(adaptation_type) {
        return this.adaptations.has(adaptation_type);
    }

    get_adaptation(adaptation_type) {
        return this.adaptations.get(adaptation_type);
    }

    get_adaptation_level(adaptation_type) {
        const adaptation = this.get_adaptation(adaptation_type);
        return adaptation ? adaptation.get_level() : 0;
    }

    add_adaptation(adaptation_type) {
        if (this.has_adaptation(adaptation_type)) {
            const adaptation = this.get_adaptation(adaptation_type);
            const leveled_up = adaptation.level_up();
            
            if (leveled_up) {
                this.apply_immediate_effects(adaptation);
            }
            
            return leveled_up;
        } else {
            const adaptation = new Adaptation(adaptation_type);
            adaptation.level_up();
            this.adaptations.set(adaptation_type, adaptation);
            this.apply_immediate_effects(adaptation);
            return true;
        }
    }

    apply_immediate_effects(adaptation) {
        if (!window.game_state) {
            return;
        }

        switch (adaptation.type) {
            case ADAPTATION_TYPES.HYPERPLASIA:
                this.apply_hyperplasia_effect(adaptation);
                break;
            case ADAPTATION_TYPES.NUTRIENT_GLUT:
                this.apply_nutrient_glut_effect(adaptation);
                break;
        }
    }

    apply_hyperplasia_effect(adaptation) {
        const hp_increase = adaptation.get_max_hp_increase();
        if (hp_increase > 0 && window.game_state.core) {
            window.game_state.core.increase_max_hp(hp_increase);
            window.game_state.core.heal(hp_increase);
        }
    }

    apply_nutrient_glut_effect(adaptation) {
        const biomass_gain = adaptation.get_biomass_gain();
        if (biomass_gain > 0 && window.game_state.resource_system) {
            window.game_state.resource_system.add_biomass(biomass_gain);
        }
    }

    apply_regenerative_cycle_healing() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.REGENERATIVE_CYCLE);
        if (adaptation) {
            const heal_amount = adaptation.get_core_heal_per_intensity();
            if (heal_amount > 0 && window.game_state.core) {
                window.game_state.core.heal(heal_amount);
            }
        }
    }

    get_total_damage_multiplier() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.CYTOTOXIC_SURGE);
        return adaptation ? adaptation.get_damage_multiplier() : 1.0;
    }

    get_energy_refund_percent() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.NECROTIC_RECYCLING);
        return adaptation ? adaptation.get_energy_refund_percent() : 0;
    }

    get_energy_cost_multiplier() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.ADRENAL_RESPONSE);
        if (!adaptation || !window.game_state || !window.game_state.core) {
            return 1.0;
        }

        if (window.game_state.core.hp <= 2) {
            return 1.0 - adaptation.get_energy_cost_reduction();
        }

        return 1.0;
    }

    get_energy_regen_multiplier() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.MITOCHONDRIAL_BOOST);
        return adaptation ? adaptation.get_energy_regen_multiplier() : 1.0;
    }

    get_cytokine_multiplier() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.CYTOKINE_INFUSION);
        return adaptation ? adaptation.get_cytokine_multiplier() : 1.0;
    }

    get_adjuvant_multiplier() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.ADJUVANT_BOLUS);
        return adaptation ? adaptation.get_adjuvant_multiplier() : 1.0;
    }

    apply_tower_destruction_refund(tower_cost) {
        const refund_percent = this.get_energy_refund_percent();
        if (refund_percent > 0 && window.game_state && window.game_state.player) {
            const refund_amount = Math.ceil(tower_cost * refund_percent);
            window.game_state.player.gain_energy(refund_amount);
        }
    }

    get_all_adaptations() {
        return Array.from(this.adaptations.values());
    }

    get_available_adaptation_choices() {
        const available_choices = [];
        
        ADAPTATION_POOL.forEach(adaptation_type => {
            const current_adaptation = this.get_adaptation(adaptation_type);
            if (!current_adaptation || !current_adaptation.is_maxed()) {
                available_choices.push(adaptation_type);
            }
        });

        return available_choices;
    }

    generate_intensity_reward_choices() {
        const available_choices = this.get_available_adaptation_choices();
        const choices = [];

        if (available_choices.length === 0) {
            for (let i = 0; i < ADAPTATION_CONFIG.REWARD_CHOICES_COUNT; i++) {
                choices.push(ADAPTATION_TYPES.NUTRIENT_GLUT);
            }
            return choices;
        }

        const needed_choices = Math.min(ADAPTATION_CONFIG.REWARD_CHOICES_COUNT, available_choices.length);

        for (let i = 0; i < needed_choices; i++) {
            const random_index = Math.floor(Math.random() * available_choices.length);
            const selected_choice = available_choices[random_index];
            choices.push(selected_choice);
            available_choices.splice(random_index, 1);
        }

        while (choices.length < ADAPTATION_CONFIG.REWARD_CHOICES_COUNT) {
            choices.push(ADAPTATION_TYPES.NUTRIENT_GLUT);
        }

        return choices;
    }
}

window.AdaptationSystem = AdaptationSystem;