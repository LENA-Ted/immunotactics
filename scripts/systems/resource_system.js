class ResourceSystem {
    constructor() {
        this.cytokines = 0;
        this.adjuvants = 0;
        this.biomass = 0;
    }

    reset() {
        this.cytokines = 0;
        this.adjuvants = 0;
        this.biomass = 0;
    }

    spawn_particles_from_enemy(enemy, game_state) {
        if (!game_state.resource_particles) {
            game_state.resource_particles = [];
        }

        this.spawn_cytokine_particles(enemy, game_state);
        this.spawn_adjuvant_particles(enemy, game_state);
        this.spawn_biomass_particles(enemy, game_state);
    }

    spawn_cytokine_particles(enemy, game_state) {
        const drop_opportunities = Math.floor(enemy.max_hp / RESOURCE_CONFIG.CYTOKINE_HP_THRESHOLD);
        
        for (let i = 0; i < drop_opportunities; i++) {
            if (Math.random() < RESOURCE_CONFIG.CYTOKINE_DROP_CHANCE) {
                const position = this.get_random_spawn_position(enemy);
                const particle = new ResourceParticle(position.x, position.y, RESOURCE_TYPES.CYTOKINES);
                game_state.resource_particles.push(particle);
            }
        }
    }

    spawn_adjuvant_particles(enemy, game_state) {
        const drop_opportunities = Math.floor(enemy.max_hp / RESOURCE_CONFIG.ADJUVANT_HP_THRESHOLD);
        
        for (let i = 0; i < drop_opportunities; i++) {
            if (Math.random() < RESOURCE_CONFIG.ADJUVANT_DROP_CHANCE) {
                const position = this.get_random_spawn_position(enemy);
                const particle = new ResourceParticle(position.x, position.y, RESOURCE_TYPES.ADJUVANTS);
                game_state.resource_particles.push(particle);
            }
        }
    }

    spawn_biomass_particles(enemy, game_state) {
        const drop_opportunities = Math.floor(enemy.max_hp / RESOURCE_CONFIG.BIOMASS_HP_THRESHOLD);
        
        for (let i = 0; i < drop_opportunities; i++) {
            if (Math.random() < RESOURCE_CONFIG.BIOMASS_DROP_CHANCE) {
                const position = this.get_random_spawn_position(enemy);
                const particle = new ResourceParticle(position.x, position.y, RESOURCE_TYPES.BIOMASS);
                game_state.resource_particles.push(particle);
            }
        }
    }

    get_random_spawn_position(enemy) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * enemy.radius;
        
        return {
            x: enemy.x + Math.cos(angle) * distance,
            y: enemy.y + Math.sin(angle) * distance
        };
    }

    collect_particle(particle, game_state) {
        const resource_type = particle.get_resource_type();
        const intensity_level = game_state.intensity_level || 0;
        const base_amount = this.calculate_resource_gain(intensity_level);

        switch (resource_type) {
            case RESOURCE_TYPES.CYTOKINES:
                const cytokine_amount = this.apply_cytokine_multiplier(base_amount);
                this.cytokines += cytokine_amount;
                this.trigger_ui_feedback(RESOURCE_TYPES.CYTOKINES);
                break;
            case RESOURCE_TYPES.ADJUVANTS:
                const adjuvant_amount = this.apply_adjuvant_multiplier(base_amount);
                this.adjuvants += adjuvant_amount;
                this.trigger_ui_feedback(RESOURCE_TYPES.ADJUVANTS);
                break;
            case RESOURCE_TYPES.BIOMASS:
                this.biomass += base_amount;
                this.trigger_ui_feedback(RESOURCE_TYPES.BIOMASS);
                break;
        }
    }

    apply_cytokine_multiplier(base_amount) {
        const multiplier = this.get_adaptation_cytokine_multiplier();
        return Math.ceil(base_amount * multiplier);
    }

    apply_adjuvant_multiplier(base_amount) {
        const multiplier = this.get_adaptation_adjuvant_multiplier();
        return Math.ceil(base_amount * multiplier);
    }

    get_adaptation_cytokine_multiplier() {
        if (window.game_state && window.game_state.adaptation_system) {
            return window.game_state.adaptation_system.get_cytokine_multiplier();
        }
        return 1.0;
    }

    get_adaptation_adjuvant_multiplier() {
        if (window.game_state && window.game_state.adaptation_system) {
            return window.game_state.adaptation_system.get_adjuvant_multiplier();
        }
        return 1.0;
    }

    calculate_resource_gain(intensity_level) {
        const min_gain = 1;
        const max_gain = Math.max(1, 1);
        return MathUtils.get_random_int(min_gain, max_gain);
    }

    trigger_ui_feedback(resource_type) {
        if (window.game_state && window.game_state.ui_system) {
            window.game_state.ui_system.trigger_resource_feedback(resource_type);
        }
    }

    get_current_damage_multiplier() {
        if (this.cytokines === 0) {
            return 1.0;
        }
        
        const bonus_percentage = this.cytokines * RESOURCE_CONFIG.CYTOKINE_DAMAGE_FACTOR;
        return 1 + (bonus_percentage / 100);
    }

    get_current_effect_multiplier() {
        if (this.adjuvants === 0) {
            return 1.0;
        }
        
        const multiplier = this.adjuvants / (RESOURCE_CONFIG.ADJUVANT_DENOMINATOR + this.adjuvants);
        return 1 + multiplier;
    }

    apply_damage_bonus(base_damage) {
        const multiplier = this.get_current_damage_multiplier();
        return Math.ceil(base_damage * multiplier);
    }

    apply_effect_bonus(base_value) {
        const multiplier = this.get_current_effect_multiplier();
        return Math.ceil(base_value * multiplier);
    }

    add_biomass(amount) {
        this.biomass += amount;
        this.trigger_ui_feedback(RESOURCE_TYPES.BIOMASS);
    }

    get_cytokines() {
        return this.cytokines;
    }

    get_adjuvants() {
        return this.adjuvants;
    }

    get_biomass() {
        return this.biomass;
    }
}

window.ResourceSystem = ResourceSystem;