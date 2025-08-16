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
        
        if (this.is_colliding_with_core(target)) {
            this.handle_core_collision(target);
            return;
        }
        
        this.move_toward_target(target);
    }

    is_colliding_with_core(core) {
        if (!core) {
            return false;
        }
        
        const distance = MathUtils.get_distance(this.x, this.y, core.x, core.y);
        return distance < this.radius + core.radius;
    }

    handle_core_collision(core) {
        core.take_damage(1);
        
        if (window.game_state && window.game_state.audio_system) {
            window.game_state.audio_system.play_sound('DAMAGE_CORE');
        }
        
        if (window.game_state && window.game_state.effects) {
            window.game_state.effects.push(new PopEffect(this.x, this.y, this.color));
        }
        
        if (window.game_state && window.game_state.resource_system) {
            window.game_state.resource_system.spawn_particles_from_enemy(this, window.game_state);
        }
        
        this.remove_from_game();
    }

    remove_from_game() {
        if (!window.game_state || !window.game_state.enemies) {
            return;
        }
        
        const enemy_index = window.game_state.enemies.indexOf(this);
        if (enemy_index !== -1) {
            window.game_state.enemies.splice(enemy_index, 1);
        }
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
        this.destroy_immune_cells_in_explosion_radius();
        this.damage_core_if_in_range();
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

    destroy_immune_cells_in_explosion_radius() {
        if (!window.game_state || !window.game_state.towers) {
            return;
        }

        const affected_towers = this.get_towers_in_explosion_radius();
        affected_towers.forEach(tower => {
            this.destroy_tower(tower);
        });
    }

    damage_core_if_in_range() {
        if (!window.game_state || !window.game_state.core) {
            return;
        }
        
        const core = window.game_state.core;
        const distance = MathUtils.get_distance(this.x, this.y, core.x, core.y);
        
        if (distance <= this.config.explosion_radius) {
            core.take_damage(1);
            
            if (window.game_state.audio_system) {
                window.game_state.audio_system.play_sound('DAMAGE_CORE');
            }
            
            if (window.game_state.effects) {
                window.game_state.effects.push(new PopEffect(core.x, core.y, '#cccccc'));
            }
        }
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

    destroy_tower(tower) {
        if (!window.game_state) {
            return;
        }
        
        if (window.game_state.effects) {
            window.game_state.effects.push(new PopEffect(tower.x, tower.y, '#cccccc'));
        }
        
        const tower_index = window.game_state.towers.indexOf(tower);
        if (tower_index !== -1) {
            window.game_state.towers.splice(tower_index, 1);
        }
        
        if (window.game_state.last_tower_damage_time && tower.id) {
            delete window.game_state.last_tower_damage_time[tower.id];
        }
    }

    is_alive() {
        return !this.has_exploded && this.hp > 0;
    }
}

window.Clostridium = Clostridium;