class Clostridium extends BaseEnemy {
    constructor(x, y) {
        super(x, y, PATHOGEN_CONFIGS.CLOSTRIDIUM, ENEMY_CATEGORIES.PATHOGEN, PATHOGEN_TYPES.CLOSTRIDIUM);
        this.has_exploded = false;
    }

    update(target, timestamp) {
        if (this.has_exploded) {
            return;
        }
        
        this.update_status_effects(timestamp);
        this.move_toward_target(target);
    }

    take_damage(amount) {
        if (this.has_exploded) {
            return false;
        }
        
        this.hp -= amount;
        this.trigger_pulsate();
        
        const is_destroyed = this.hp <= 0;
        if (is_destroyed) {
            this.explode();
        }
        
        return is_destroyed;
    }

    explode() {
        if (this.has_exploded) {
            return;
        }

        this.has_exploded = true;
        
        if (window.game_state && window.game_state.audio_system) {
            window.game_state.audio_system.play_sound('EXPLOSION');
        }
        
        this.create_explosion_effect();
        this.trigger_screen_shake();
        this.damage_immune_cells_in_explosion_radius();
    }

    create_explosion_effect() {
        if (window.game_state && window.game_state.effects) {
            const explosion = new ExplosionEffect(
                this.x, 
                this.y, 
                this.config.explosion_radius,
                'PATHOGEN',
                null
            );
            window.game_state.effects.push(explosion);
        }
    }

    trigger_screen_shake() {
        if (window.game_state && window.game_state.screen_shake) {
            window.game_state.screen_shake.trigger(
                GAME_CONFIG.SCREEN_SHAKE_MAGNITUDE,
                GAME_CONFIG.SCREEN_SHAKE_DURATION_FRAMES
            );
        }
    }

    damage_immune_cells_in_explosion_radius() {
        if (!window.game_state || !window.game_state.towers) {
            return;
        }

        const damage = this.calculate_explosion_damage();
        const affected_towers = this.get_towers_in_explosion_radius();

        affected_towers.forEach(tower => {
            this.damage_tower(tower, damage);
        });
    }

    calculate_explosion_damage() {
        const intensity_level = window.game_state ? window.game_state.intensity_level : 0;
        return Math.max(1, intensity_level);
    }

    get_towers_in_explosion_radius() {
        if (!window.game_state || !window.game_state.towers) {
            return [];
        }

        return window.game_state.towers.filter(tower => {
            const distance = MathUtils.get_distance(this.x, this.y, tower.x, tower.y);
            return distance <= this.config.explosion_radius;
        });
    }

    damage_tower(tower, damage) {
        tower.hp -= damage;
        tower.trigger_pulsate();
        
        if (window.game_state && window.game_state.damage_numbers) {
            window.game_state.damage_numbers.push(new DamageNumber(tower.x, tower.y, damage));
        }

        if (window.game_state && window.game_state.effects) {
            window.game_state.effects.push(new PopEffect(tower.x, tower.y, '#cccccc'));
        }
    }

    is_alive() {
        return !this.has_exploded && this.hp > 0;
    }
}

window.Clostridium = Clostridium;