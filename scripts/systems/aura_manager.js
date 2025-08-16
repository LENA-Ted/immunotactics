class AuraManager {
    constructor() {
        this.candida_entities = [];
        this.adenovirus_entities = [];
    }

    update(game_state) {
        this.update_entity_lists(game_state);
        this.update_healing_flags(game_state);
        this.update_permeated_flags(game_state);
        this.update_aura_visuals();
    }

    update_entity_lists(game_state) {
        if (!game_state.enemies) {
            this.candida_entities = [];
            this.adenovirus_entities = [];
            return;
        }

        this.candida_entities = game_state.enemies.filter(enemy => 
            enemy.get_type() === PATHOGEN_TYPES.CANDIDA && enemy.is_alive()
        );

        this.adenovirus_entities = game_state.enemies.filter(enemy => 
            enemy.get_type() === PATHOGEN_TYPES.ADENOVIRUS && enemy.is_alive()
        );
    }

    update_healing_flags(game_state) {
        if (!game_state.enemies) {
            return;
        }

        game_state.enemies.forEach(enemy => {
            const should_be_healing = this.is_enemy_in_any_candida_aura(enemy);
            enemy.healing_flag = should_be_healing;
        });
    }

    update_permeated_flags(game_state) {
        if (!game_state.enemies) {
            return;
        }

        game_state.enemies.forEach(enemy => {
            if (!enemy.is_microbe || !enemy.is_microbe()) {
                return;
            }

            const should_be_permeated = this.is_enemy_in_any_adenovirus_aura(enemy);
            const is_currently_permeated = enemy.has_status_effect && enemy.has_status_effect('PERMEATED');

            if (should_be_permeated && !is_currently_permeated) {
                const permeated_effect = new PermeatedEffect();
                enemy.add_status_effect(permeated_effect);
                enemy.permeated_flag = true;
            } else if (!should_be_permeated && is_currently_permeated) {
                this.remove_permeated_status(enemy);
                enemy.permeated_flag = false;
            } else {
                enemy.permeated_flag = should_be_permeated;
            }
        });
    }

    is_enemy_in_any_candida_aura(enemy) {
        return this.candida_entities.some(candida => {
            const distance = MathUtils.get_distance(candida.x, candida.y, enemy.x, enemy.y);
            return distance <= candida.config.aura_radius && candida !== enemy;
        });
    }

    is_enemy_in_any_adenovirus_aura(enemy) {
        return this.adenovirus_entities.some(adenovirus => {
            const distance = MathUtils.get_distance(adenovirus.x, adenovirus.y, enemy.x, enemy.y);
            return distance <= adenovirus.config.aura_radius && adenovirus !== enemy;
        });
    }

    remove_permeated_status(enemy) {
        if (!enemy.status_effects) {
            return;
        }

        const permeated_effects = enemy.status_effects.filter(effect => 
            effect.get_type() === 'PERMEATED'
        );

        permeated_effects.forEach(effect => {
            effect.remove_effect(enemy);
            const effect_index = enemy.status_effects.indexOf(effect);
            if (effect_index !== -1) {
                enemy.status_effects.splice(effect_index, 1);
            }
        });
    }

    update_aura_visuals() {
        this.candida_entities.forEach(candida => {
            if (candida.healing_aura) {
                candida.healing_aura.update_pulse_animation();
            }
        });

        this.adenovirus_entities.forEach(adenovirus => {
            if (adenovirus.permeation_aura) {
                adenovirus.permeation_aura.update_pulse_animation();
            }
        });
    }

    reset() {
        this.candida_entities = [];
        this.adenovirus_entities = [];
    }
}

window.AuraManager = AuraManager;