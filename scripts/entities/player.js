class Player {
    constructor() {
        this.energy = GAME_CONFIG.PLAYER_MAX_ENERGY;
        this.max_energy = GAME_CONFIG.PLAYER_MAX_ENERGY;
        this.last_energy_regen_time = 0;
    }

    update(timestamp) {
        if (this.energy >= this.max_energy) {
            return;
        }

        if (timestamp - this.last_energy_regen_time > GAME_CONFIG.ENERGY_REGEN_INTERVAL_MS) {
            const base_regen = GAME_CONFIG.ENERGY_REGEN_RATE;
            const modified_regen = this.apply_energy_regen_multiplier(base_regen);
            this.energy = Math.min(this.max_energy, this.energy + modified_regen);
            this.last_energy_regen_time = timestamp;
        }
    }

    apply_energy_regen_multiplier(base_regen) {
        const multiplier = this.get_energy_regen_multiplier();
        return Math.ceil(base_regen * multiplier);
    }

    get_energy_regen_multiplier() {
        if (window.game_state && window.game_state.adaptation_system) {
            return window.game_state.adaptation_system.get_energy_regen_multiplier();
        }
        return 1.0;
    }

    can_afford(cost) {
        const modified_cost = this.apply_energy_cost_reduction(cost);
        return this.energy >= modified_cost;
    }

    spend_energy(amount) {
        const modified_cost = this.apply_energy_cost_reduction(amount);
        if (this.can_afford_raw_cost(modified_cost)) {
            this.energy -= modified_cost;
            return true;
        }
        return false;
    }

    can_afford_raw_cost(cost) {
        return this.energy >= cost;
    }

    apply_energy_cost_reduction(cost) {
        const multiplier = this.get_energy_cost_multiplier();
        return Math.ceil(cost * multiplier);
    }

    get_energy_cost_multiplier() {
        if (window.game_state && window.game_state.adaptation_system) {
            return window.game_state.adaptation_system.get_energy_cost_multiplier();
        }
        return 1.0;
    }

    gain_energy(amount) {
        this.energy = Math.min(this.max_energy, this.energy + amount);
    }

    get_energy_percentage() {
        return this.energy / this.max_energy;
    }
}

window.Player = Player;