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

        const intensity_level = game_state.intensity_level || 0;
        const drop_attempts = intensity_level + 1;

        this.spawn_cytokine_particles(enemy, game_state, drop_attempts);
        this.spawn_adjuvant_particles(enemy, game_state, drop_attempts);
        this.spawn_biomass_particles(enemy, game_state, drop_attempts);
    }

    spawn_cytokine_particles(enemy, game_state, drop_attempts) {
        for (let i = 0; i < drop_attempts; i++) {
            if (Math.random() < RESOURCE_CONFIG.CYTOKINE_DROP_CHANCE_PER_LEVEL) {
                const position = this.get_random_spawn_position(enemy);
                const particle = new ResourceParticle(position.x, position.y, RESOURCE_TYPES.CYTOKINES);
                game_state.resource_particles.push(particle);
            }
        }
    }

    spawn_adjuvant_particles(enemy, game_state, drop_attempts) {
        for (let i = 0; i < drop_attempts; i++) {
            if (Math.random() < RESOURCE_CONFIG.ADJUVANT_DROP_CHANCE_PER_LEVEL) {
                const position = this.get_random_spawn_position(enemy);
                const particle = new ResourceParticle(position.x, position.y, RESOURCE_TYPES.ADJUVANTS);
                game_state.resource_particles.push(particle);
            }
        }
    }

    spawn_biomass_particles(enemy, game_state, drop_attempts) {
        for (let i = 0; i < drop_attempts; i++) {
            if (Math.random() < RESOURCE_CONFIG.BIOMASS_DROP_CHANCE_PER_LEVEL) {
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

        switch (resource_type) {
            case RESOURCE_TYPES.CYTOKINES:
                this.collect_cytokine_particle();
                break;
            case RESOURCE_TYPES.ADJUVANTS:
                this.collect_adjuvant_particle();
                break;
            case RESOURCE_TYPES.BIOMASS:
                this.collect_biomass_particle();
                break;
        }
    }

    collect_cytokine_particle() {
        let base_amount = 1;
        
        const double_chance = this.get_cytokine_double_chance();
        if (double_chance > 0 && Math.random() < double_chance) {
            base_amount *= 2;
        }
        
        this.cytokines += base_amount;
        this.trigger_ui_feedback(RESOURCE_TYPES.CYTOKINES);
    }

    collect_adjuvant_particle() {
        let base_amount = 1;
        
        const double_chance = this.get_adjuvant_double_chance();
        if (double_chance > 0 && Math.random() < double_chance) {
            base_amount *= 2;
        }
        
        this.adjuvants += base_amount;
        this.trigger_ui_feedback(RESOURCE_TYPES.ADJUVANTS);
    }

    collect_biomass_particle() {
        let base_amount = 1;
        
        const double_chance = this.get_biomass_double_chance();
        if (double_chance > 0 && Math.random() < double_chance) {
            base_amount *= 2;
        }
        
        this.biomass += base_amount;
        this.trigger_ui_feedback(RESOURCE_TYPES.BIOMASS);
    }

    get_cytokine_double_chance() {
        if (window.game_state && window.game_state.adaptation_system) {
            return window.game_state.adaptation_system.get_cytokine_double_chance();
        }
        return 0;
    }

    get_adjuvant_double_chance() {
        if (window.game_state && window.game_state.adaptation_system) {
            return window.game_state.adaptation_system.get_adjuvant_double_chance();
        }
        return 0;
    }

    get_biomass_double_chance() {
        if (window.game_state && window.game_state.adaptation_system) {
            return window.game_state.adaptation_system.get_biomass_double_chance();
        }
        return 0;
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

    get_action_cooldown_multiplier() {
        if (this.adjuvants === 0) {
            return 1.0;
        }
        
        const reduction_percentage = (this.adjuvants * RESOURCE_CONFIG.ADJUVANT_COOLDOWN_MULTIPLIER) / (RESOURCE_CONFIG.ADJUVANT_COOLDOWN_DENOMINATOR + this.adjuvants);
        return 1 - reduction_percentage;
    }

    get_adjuvant_hp_multiplier() {
        if (this.adjuvants === 0) {
            return 1.0;
        }
        
        const bonus_percentage = (this.adjuvants * RESOURCE_CONFIG.ADJUVANT_COOLDOWN_MULTIPLIER) / (RESOURCE_CONFIG.ADJUVANT_COOLDOWN_DENOMINATOR + this.adjuvants);
        return 1 + bonus_percentage;
    }

    apply_damage_bonus(base_damage) {
        const multiplier = this.get_current_damage_multiplier();
        return Math.ceil(base_damage * multiplier);
    }

    add_biomass(amount) {
        this.biomass += amount;
        this.trigger_ui_feedback(RESOURCE_TYPES.BIOMASS);
    }

    add_cytokines(amount) {
        this.cytokines += amount;
        this.trigger_ui_feedback(RESOURCE_TYPES.CYTOKINES);
    }

    add_adjuvants(amount) {
        this.adjuvants += amount;
        this.trigger_ui_feedback(RESOURCE_TYPES.ADJUVANTS);
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