class AdaptationSystem {
    constructor() {
        this.adaptations = new Map();
        this.necrotrophic_repair_counter = 0;
    }

    reset() {
        this.adaptations.clear();
        this.necrotrophic_repair_counter = 0;
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
        if (this.is_generic_adaptation(adaptation_type)) {
            this.apply_generic_adaptation_effect(adaptation_type);
            return true;
        }

        if (this.has_adaptation(adaptation_type)) {
            const adaptation = this.get_adaptation(adaptation_type);
            const leveled_up = adaptation.level_up();
            
            if (leveled_up) {
                this.apply_immediate_effects(adaptation);
            }
            
            return leveled_up;
        } else {
            const adaptation = new Adaptation(adaptation_type);
            this.adaptations.set(adaptation_type, adaptation);
            this.apply_immediate_effects(adaptation);
            return true;
        }
    }

    is_generic_adaptation(adaptation_type) {
        return GENERIC_ADAPTATIONS.includes(adaptation_type);
    }

    apply_generic_adaptation_effect(adaptation_type) {
        switch (adaptation_type) {
            case ADAPTATION_TYPES.NUTRIENT_GLUT:
                this.apply_nutrient_glut_effect();
                break;
            case ADAPTATION_TYPES.CYTOKINE_CACHE:
                this.apply_cytokine_cache_effect();
                break;
            case ADAPTATION_TYPES.ADJUVANT_HOARD:
                this.apply_adjuvant_hoard_effect();
                break;
        }
    }

    apply_nutrient_glut_effect() {
        const biomass_gain = ADAPTATION_CONFIGS.NUTRIENT_GLUT.effects[0].biomass_gain;
        if (biomass_gain > 0 && window.game_state.resource_system) {
            window.game_state.resource_system.add_biomass(biomass_gain);
        }
    }

    apply_cytokine_cache_effect() {
        const cytokine_gain = ADAPTATION_CONFIGS.CYTOKINE_CACHE.effects[0].cytokine_gain;
        if (cytokine_gain > 0 && window.game_state.resource_system) {
            window.game_state.resource_system.add_cytokines(cytokine_gain);
        }
    }

    apply_adjuvant_hoard_effect() {
        const adjuvant_gain = ADAPTATION_CONFIGS.ADJUVANT_HOARD.effects[0].adjuvant_gain;
        if (adjuvant_gain > 0 && window.game_state.resource_system) {
            window.game_state.resource_system.add_adjuvants(adjuvant_gain);
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
        }
    }

    apply_hyperplasia_effect(adaptation) {
        const hp_increase = adaptation.get_max_hp_increase();
        if (hp_increase > 0 && window.game_state.core) {
            window.game_state.core.set_max_hp_bonus(hp_increase);
            window.game_state.core.heal_to_max();
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
        let total_bonus = 0;

        const cytotoxic_surge = this.get_adaptation(ADAPTATION_TYPES.CYTOTOXIC_SURGE);
        if (cytotoxic_surge) {
            total_bonus += cytotoxic_surge.get_damage_multiplier() - 1.0;
        }

        const homeostatic_potentiation = this.get_adaptation(ADAPTATION_TYPES.HOMEOSTATIC_POTENTIATION);
        if (homeostatic_potentiation && window.game_state && window.game_state.core) {
            const core_hp = window.game_state.core.hp;
            const damage_per_hp = homeostatic_potentiation.get_damage_per_core_hp_percent();
            total_bonus += core_hp * damage_per_hp;
        }

        return 1.0 + total_bonus;
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

    get_cytokine_double_chance() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.CYTOKINE_INFUSION);
        return adaptation ? adaptation.get_cytokine_double_chance() : 0;
    }

    get_adjuvant_double_chance() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.ADJUVANT_BOLUS);
        return adaptation ? adaptation.get_adjuvant_double_chance() : 0;
    }

    get_free_placement_chance() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.SPONTANEOUS_GENERATION);
        return adaptation ? adaptation.get_free_placement_chance() : 0;
    }

    get_status_effect_duration_multiplier() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.CHRONIC_INFLAMMATION);
        return adaptation ? adaptation.get_status_effect_duration_multiplier() : 1.0;
    }

    get_energy_per_kill() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.CATABOLIC_CONVERSION);
        return adaptation ? adaptation.get_energy_per_kill() : 0;
    }

    get_range_multiplier() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.EXTENDED_CHEMOTAXIS);
        return adaptation ? adaptation.get_range_multiplier() : 1.0;
    }

    get_biomass_double_chance() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.BIOMASS_INJECTION);
        return adaptation ? adaptation.get_biomass_double_chance() : 0;
    }

    handle_enemy_killed() {
        this.apply_catabolic_conversion();
        this.apply_necrotrophic_repair();
    }

    apply_catabolic_conversion() {
        const energy_gain = this.get_energy_per_kill();
        if (energy_gain > 0 && window.game_state && window.game_state.player) {
            window.game_state.player.gain_energy(energy_gain);
        }
    }

    apply_necrotrophic_repair() {
        const adaptation = this.get_adaptation(ADAPTATION_TYPES.NECROTROPHIC_REPAIR);
        if (!adaptation) {
            return;
        }

        this.necrotrophic_repair_counter++;

        if (this.necrotrophic_repair_counter >= 10) {
            const heal_amount = adaptation.get_hp_per_ten_kills();
            this.heal_all_towers(heal_amount);
            this.necrotrophic_repair_counter = 0;
        }
    }

    heal_all_towers(heal_amount) {
        if (!window.game_state || !window.game_state.towers || heal_amount <= 0) {
            return;
        }

        window.game_state.towers.forEach(tower => {
            tower.hp = Math.min(tower.max_hp, tower.hp + heal_amount);
        });
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
            return this.fill_choices_with_generic_adaptations([], ADAPTATION_CONFIG.REWARD_CHOICES_COUNT);
        }

        const needed_choices = Math.min(ADAPTATION_CONFIG.REWARD_CHOICES_COUNT, available_choices.length);

        for (let i = 0; i < needed_choices; i++) {
            const random_index = Math.floor(Math.random() * available_choices.length);
            const selected_choice = available_choices[random_index];
            choices.push(selected_choice);
            available_choices.splice(random_index, 1);
        }

        if (choices.length < ADAPTATION_CONFIG.REWARD_CHOICES_COUNT) {
            return this.fill_choices_with_generic_adaptations(choices, ADAPTATION_CONFIG.REWARD_CHOICES_COUNT - choices.length);
        }

        return choices;
    }

    fill_choices_with_generic_adaptations(existing_choices, slots_to_fill) {
        const available_generics = [...GENERIC_ADAPTATIONS];
        const choices = [...existing_choices];

        for (let i = 0; i < slots_to_fill; i++) {
            if (available_generics.length === 0) {
                choices.push(ADAPTATION_TYPES.NUTRIENT_GLUT);
            } else {
                const random_index = Math.floor(Math.random() * available_generics.length);
                const selected_generic = available_generics[random_index];
                choices.push(selected_generic);
                available_generics.splice(random_index, 1);
            }
        }

        return choices;
    }
}

window.AdaptationSystem = AdaptationSystem;