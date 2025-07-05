class CollisionSystem {
    constructor() {
    }

    handle_all_collisions(game_state) {
        this.handle_projectile_enemy_collisions(game_state);
        this.handle_enemy_tower_collisions(game_state);
        this.handle_enemy_core_collisions(game_state);
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
                    this.handle_enemy_hit_tower(enemy, tower, i, j, game_state);
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

    handle_projectile_hit_enemy(projectile, enemy, projectile_index, enemy_index, game_state) {
        const damage = projectile.get_damage();
        const is_enemy_destroyed = enemy.take_damage(damage);

        game_state.damage_numbers.push(new DamageNumber(enemy.x, enemy.y, damage));

        game_state.projectiles.splice(projectile_index, 1);

        if (is_enemy_destroyed) {
            game_state.effects.push(new PopEffect(enemy.x, enemy.y, enemy.color));
            game_state.enemies.splice(enemy_index, 1);
            this.handle_enemy_destroyed(game_state);
        }
    }

    handle_enemy_hit_tower(enemy, tower, enemy_index, tower_index, game_state) {
        game_state.effects.push(new PopEffect(enemy.x, enemy.y, enemy.color));
        game_state.effects.push(new PopEffect(tower.x, tower.y, '#cccccc'));

        game_state.enemies.splice(enemy_index, 1);
        game_state.towers.splice(tower_index, 1);

        if (window.game_state && window.game_state.last_tower_damage_time) {
            delete window.game_state.last_tower_damage_time[tower.id];
        }

        this.handle_enemy_destroyed(game_state);
    }

    handle_enemy_hit_core(enemy, core, enemy_index, game_state) {
        const core_destroyed = core.take_damage(1);
        
        game_state.effects.push(new PopEffect(enemy.x, enemy.y, enemy.color));
        
        game_state.enemies.splice(enemy_index, 1);

        if (core_destroyed) {
            game_state.is_game_over = true;
        }

        this.handle_enemy_destroyed(game_state);
    }

    handle_enemy_destroyed(game_state) {
        game_state.killcount++;
        game_state.total_killcount++;
        game_state.intensity_pulsate.trigger();

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
        game_state.intensity_pulsate.trigger();
    }

    is_circle_collision(entity1, entity2) {
        const distance = MathUtils.get_distance(entity1.x, entity1.y, entity2.x, entity2.y);
        return distance < entity1.radius + entity2.radius;
    }
}

window.CollisionSystem = CollisionSystem;