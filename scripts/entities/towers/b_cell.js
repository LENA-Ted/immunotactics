class BCell extends BaseTower {
    constructor(x, y, id) {
        super(x, y, id, IMMUNE_CELL_CONFIGS.B_CELL);
    }

    check_activity_criteria() {
        return window.game_state && 
               window.game_state.enemies && 
               window.game_state.enemies.length > 0;
    }

    perform_action(timestamp) {
        if (!this.has_targets()) {
            return;
        }

        if (!this.can_afford_action()) {
            return;
        }

        this.consume_action_cost();
        this.shoot();
    }

    has_targets() {
        return this.check_activity_criteria();
    }

    shoot() {
        const target = this.find_target();
        if (target) {
            this.create_projectile(target);
        }
    }

    find_target() {
        if (!window.game_state || !window.game_state.enemies) {
            return null;
        }

        return this.find_closest_enemy(window.game_state.enemies);
    }

    find_closest_enemy(enemies) {
        let closest_distance = Infinity;
        let closest_enemies = [];

        enemies.forEach(enemy => {
            const distance = MathUtils.get_distance(this.x, this.y, enemy.x, enemy.y);
            if (distance < closest_distance) {
                closest_distance = distance;
                closest_enemies = [enemy];
            } else if (distance === closest_distance) {
                closest_enemies.push(enemy);
            }
        });

        if (closest_enemies.length === 0) {
            return null;
        }

        return closest_enemies[Math.floor(Math.random() * closest_enemies.length)];
    }

    create_projectile(target) {
        if (window.game_state && window.game_state.projectiles) {
            const projectile = new Projectile(this.x, this.y, target, this);
            
            let base_damage = this.config.projectile_damage;
            if (window.game_state.resource_system) {
                base_damage = window.game_state.resource_system.apply_damage_bonus(base_damage);
            }
            
            projectile.damage = base_damage;
            window.game_state.projectiles.push(projectile);
        }
    }
}

window.BCell = BCell;