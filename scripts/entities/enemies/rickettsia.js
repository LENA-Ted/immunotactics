class Rickettsia extends BaseEnemy {
    constructor(x, y) {
        super(x, y, PATHOGEN_CONFIGS.RICKETTSIA, ENEMY_CATEGORIES.PATHOGEN, PATHOGEN_TYPES.RICKETTSIA);
        this.last_action_time = 0;
        this.action_interval_ms = this.config.action_interval_ms;
        this.inoculation_range = this.config.inoculation_range;
    }

    update(target, timestamp) {
        this.update_status_effects(timestamp);
        this.move_toward_target(target);
        this.attempt_inoculation_action(timestamp);
    }

    attempt_inoculation_action(timestamp) {
        if (!this.last_action_time) {
            this.last_action_time = this.get_current_adjusted_time(timestamp);
            return;
        }

        const adjusted_elapsed = this.get_adjusted_elapsed_time_since_last_action(timestamp);
        
        if (adjusted_elapsed >= this.action_interval_ms) {
            this.perform_inoculation_action();
            this.last_action_time = this.get_current_adjusted_time(timestamp);
        }
    }

    get_current_adjusted_time(timestamp) {
        if (window.game_state && window.game_state.get_adjusted_elapsed_time) {
            return window.game_state.get_adjusted_elapsed_time(0);
        }
        return timestamp;
    }

    get_adjusted_elapsed_time_since_last_action(timestamp) {
        const current_adjusted_time = this.get_current_adjusted_time(timestamp);
        return current_adjusted_time - this.last_action_time;
    }

    perform_inoculation_action() {
        const eligible_microbe = this.find_eligible_microbe();
        
        if (!eligible_microbe) {
            return;
        }

        this.apply_inoculation_to_microbe(eligible_microbe);
        this.create_lightning_effect_to_target(eligible_microbe);
        this.play_lightning_sound();
    }

    find_eligible_microbe() {
        if (!window.game_state || !window.game_state.enemies) {
            return null;
        }

        const eligible_microbes = window.game_state.enemies.filter(enemy => 
            enemy && this.is_eligible_microbe(enemy)
        );

        if (eligible_microbes.length === 0) {
            return null;
        }

        const random_index = Math.floor(Math.random() * eligible_microbes.length);
        return eligible_microbes[random_index];
    }

    is_eligible_microbe(enemy) {
        if (!enemy) {
            return false;
        }

        if (!enemy.is_microbe()) {
            return false;
        }

        if (!this.is_in_inoculation_range(enemy)) {
            return false;
        }

        if (this.has_inoculated_status(enemy)) {
            return false;
        }

        return true;
    }

    is_in_inoculation_range(target) {
        if (!target) {
            return false;
        }
        const distance = MathUtils.get_distance(this.x, this.y, target.x, target.y);
        return distance <= this.inoculation_range;
    }

    has_inoculated_status(enemy) {
        if (!enemy || !enemy.has_status_effect) {
            return false;
        }
        return enemy.has_status_effect('INOCULATED');
    }

    apply_inoculation_to_microbe(microbe) {
        if (!microbe) {
            return;
        }
        this.clear_immune_cell_status_effects(microbe);
        this.apply_inoculated_status_effect(microbe);
    }

    clear_immune_cell_status_effects(microbe) {
        if (!microbe || !microbe.status_effects) {
            return;
        }

        const effects_to_remove = microbe.status_effects.filter(effect => 
            effect && typeof effect.is_from_immune_cell === 'function' && effect.is_from_immune_cell()
        );

        effects_to_remove.forEach(effect => {
            effect.remove_effect(microbe);
            const effect_index = microbe.status_effects.indexOf(effect);
            if (effect_index !== -1) {
                microbe.status_effects.splice(effect_index, 1);
            }
        });
    }

    apply_inoculated_status_effect(microbe) {
        if (!microbe || !microbe.add_status_effect) {
            return;
        }
        const inoculated_effect = new InoculatedEffect();
        microbe.add_status_effect(inoculated_effect);
    }

    create_lightning_effect_to_target(target) {
        if (!target || !window.game_state || !window.game_state.effects) {
            return;
        }

        const lightning = new LightningEffect(this.x, this.y, target.x, target.y);
        window.game_state.effects.push(lightning);
    }

    play_lightning_sound() {
        if (window.game_state && window.game_state.audio_system) {
            window.game_state.audio_system.play_sound('APPLY_LIGHTNING');
        }
    }
}

window.Rickettsia = Rickettsia;