class Interferon extends BaseTower {
    constructor(x, y, id) {
        super(x, y, id, IMMUNE_CELL_CONFIGS.INTERFERON);
    }

    check_activity_criteria() {
        return true;
    }

    perform_action(timestamp) {
        if (!this.can_afford_action()) {
            return;
        }

        this.consume_action_cost();
        this.release_wave();
    }

    release_wave() {
        this.create_wave_effect();
        this.apply_interfered_to_enemies();
    }

    create_wave_effect() {
        if (window.game_state && window.game_state.effects) {
            const wave = new WaveEffect(this.x, this.y, this.range);
            window.game_state.effects.push(wave);
        }
    }

    apply_interfered_to_enemies() {
        if (!window.game_state || !window.game_state.enemies) {
            return;
        }

        let effect_duration = this.config.interfered_duration_ms;
        
        if (window.game_state.resource_system) {
            effect_duration = window.game_state.resource_system.apply_effect_bonus(effect_duration);
        }

        window.game_state.enemies.forEach(enemy => {
            if (this.is_in_range(enemy)) {
                const interfered_effect = new InterferedEffect(effect_duration);
                enemy.add_status_effect(interfered_effect);
            }
        });
    }
}

window.Interferon = Interferon;