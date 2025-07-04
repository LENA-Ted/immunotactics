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
            this.energy = Math.min(this.max_energy, this.energy + GAME_CONFIG.ENERGY_REGEN_RATE);
            this.last_energy_regen_time = timestamp;
        }
    }

    can_afford(cost) {
        return this.energy >= cost;
    }

    spend_energy(amount) {
        if (this.can_afford(amount)) {
            this.energy -= amount;
            return true;
        }
        return false;
    }

    get_energy_percentage() {
        return this.energy / this.max_energy;
    }
}

window.Player = Player;