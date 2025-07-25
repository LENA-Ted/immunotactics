class CollisionSystem {
    constructor() {
    }

    handle_all_collisions(game_state, cursor_state) {
        this.handle_projectile_enemy_collisions(game_state);
        this.handle_enemy_tower_collisions(game_state);
        this.handle_enemy_core_collisions(game_state);
        this.handle_particle_cursor_collisions(game_state, cursor_state);
    }

    handle_projectile_enemy_collisions(game_state) {
        const { projectiles, enemies, damage_numbers, effects } = game_state;

        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];
            let collision_found = false;

            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];

                if (this.is_circle_collision(projectile, enemy)) {
                    this.handle_projectile_hit_enemy(projectile, enemy, i, j, game_state);
                    collision_found = true;
                    break;
                }
            }

            if (collision_found) {
                continue;
            }
        }
    }

    handle_enemy_tower_collisions(game_state) {
        const { enemies, towers, effects } = game_state;

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];

            for (let j = towers.length - 1; j >= 0; j--) {
                const tower = towers[j];

                if (this.is_circle_collision(enemy, tower)) {
                    if (enemy.is_pathogen()) {
                        this.handle_pathogen_hit_tower(enemy, tower, i, j, game_state);
                    } else {
                        this.handle_enemy_hit_tower(enemy, tower, i, j, game_state);
                    }
                    break;
                }
            }
        }
    }

    handle_enemy_core_collisions(game_state) {
        const { enemies, core, effects } = game_state;

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];

            if (this.is_circle_collision(enemy, core)) {
                this.handle_enemy_hit_core(enemy, core, i, game_state);
            }
        }
    }

    handle_particle_cursor_collisions(game_state, cursor_state) {
        if (!game_state.resource_particles || !cursor_state) {
            return;
        }

        for (let i = game_state.resource_particles.length - 1; i >= 0; i--) {
            const particle = game_state.resource_particles[i];
            
            if (particle.is_collected_by_cursor(cursor_state.x, cursor_state.y)) {
                this.handle_particle_collected(particle, i, game_state);
            }
        }
    }

    handle_particle_collected(particle, particle_index, game_state) {
        if (game_state.resource_system) {
            game_state.resource_system.collect_particle(particle, game_state);
        }
        
        game_state.resource_particles.splice(particle_index, 1);
    }

    handle_projectile_hit_enemy(projectile, enemy, projectile_index, enemy_index, game_state) {
        const damage = projectile.get_damage();
        const is_enemy_destroyed = enemy.take_damage(damage);

        game_state.damage_numbers.push(new DamageNumber(enemy.x, enemy.y, damage));

        game_state.projectiles.splice(projectile_index, 1);

        if (is_enemy_destroyed) {
            game_state.effects.push(new PopEffect(enemy.x, enemy.y, enemy.color));
            
            if (game_state.resource_system) {
                game_state.resource_system.spawn_particles_from_enemy(enemy, game_state);
            }
            
            game_state.enemies.splice(enemy_index, 1);
            this.handle_enemy_destroyed(game_state);
        }
    }

    handle_enemy_hit_tower(enemy, tower, enemy_index, tower_index, game_state) {
        game_state.effects.push(new PopEffect(enemy.x, enemy.y, enemy.color));
        game_state.effects.push(new PopEffect(tower.x, tower.y, '#cccccc'));

        if (game_state.resource_system) {
            game_state.resource_system.spawn_particles_from_enemy(enemy, game_state);
        }

        this.apply_necrotic_recycling_refund(tower, game_state);

        game_state.enemies.splice(enemy_index, 1);
        game_state.towers.splice(tower_index, 1);

        if (window.game_state && window.game_state.last_tower_damage_time) {
            delete window.game_state.last_tower_damage_time[tower.id];
        }

        this.handle_enemy_destroyed(game_state);
    }

    handle_pathogen_hit_tower(pathogen, tower, pathogen_index, tower_index, game_state) {
        const contact_damage = this.calculate_pathogen_contact_damage(pathogen);
        const is_pathogen_destroyed = pathogen.take_damage(contact_damage);

        game_state.damage_numbers.push(new DamageNumber(pathogen.x, pathogen.y, contact_damage));
        game_state.effects.push(new PopEffect(tower.x, tower.y, '#cccccc'));

        if (game_state.resource_system) {
            game_state.resource_system.spawn_particles_from_enemy(pathogen, game_state);
        }

        this.apply_necrotic_recycling_refund(tower, game_state);

        game_state.towers.splice(tower_index, 1);

        if (window.game_state && window.game_state.last_tower_damage_time) {
            delete window.game_state.last_tower_damage_time[tower.id];
        }

        if (is_pathogen_destroyed) {
            game_state.effects.push(new PopEffect(pathogen.x, pathogen.y, pathogen.color));
            game_state.enemies.splice(pathogen_index, 1);
            this.handle_enemy_destroyed(game_state);
        }
    }

    calculate_pathogen_contact_damage(pathogen) {
        const percentage_damage = Math.ceil(pathogen.max_hp * PATHOGEN_SYSTEM_CONFIG.PATHOGEN_CONTACT_DAMAGE_PERCENTAGE);
        return Math.max(PATHOGEN_SYSTEM_CONFIG.MINIMUM_CONTACT_DAMAGE, percentage_damage);
    }

    handle_enemy_hit_core(enemy, core, enemy_index, game_state) {
        const core_destroyed = core.take_damage(1);
        
        game_state.effects.push(new PopEffect(enemy.x, enemy.y, enemy.color));
        
        if (game_state.resource_system) {
            game_state.resource_system.spawn_particles_from_enemy(enemy, game_state);
        }
        
        game_state.enemies.splice(enemy_index, 1);

        if (core_destroyed) {
            game_state.is_game_over = true;
        }

        this.handle_enemy_destroyed(game_state);
    }

    apply_necrotic_recycling_refund(tower, game_state) {
        if (game_state.adaptation_system && tower.get_cost) {
            const tower_cost = tower.get_cost();
            game_state.adaptation_system.apply_tower_destruction_refund(tower_cost);
        }
    }

    handle_enemy_destroyed(game_state) {
        game_state.killcount++;
        game_state.total_killcount++;
        game_state.intensity_gauge_pulsate.trigger();

        if (game_state.adaptation_system) {
            game_state.adaptation_system.handle_enemy_killed();
        }

        if (game_state.killcount >= game_state.killcount_required) {
            this.handle_intensity_level_up(game_state);
        }
    }

    handle_intensity_level_up(game_state) {
        if (game_state.intensity_level >= INTENSITY_CONFIG.MAX_INTENSITY_LEVEL) {
            return;
        }

        game_state.intensity_level++;
        game_state.killcount = 0;
        game_state.killcount_required = Math.ceil(
            game_state.killcount_required * INTENSITY_CONFIG.KILLCOUNT_SCALING_FACTOR
        );
        game_state.killcount_required = Math.min(
            game_state.killcount_required, 
            INTENSITY_CONFIG.MAX_KILLCOUNT_REQUIREMENT
        );
        game_state.intensity_level_pulsate.trigger();

        this.apply_regenerative_cycle_healing(game_state);
        this.trigger_intensity_reward_modal(game_state);
    }

    apply_regenerative_cycle_healing(game_state) {
        if (game_state.adaptation_system) {
            game_state.adaptation_system.apply_regenerative_cycle_healing();
        }
    }

    trigger_intensity_reward_modal(game_state) {
        if (game_state.intensity_reward_system) {
            game_state.is_game_paused = true;
            game_state.intensity_reward_system.show_intensity_reward_modal();
        }
    }

    is_circle_collision(entity1, entity2) {
        const distance = MathUtils.get_distance(entity1.x, entity1.y, entity2.x, entity2.y);
        return distance < entity1.radius + entity2.radius;
    }
}

window.CollisionSystem = CollisionSystem;