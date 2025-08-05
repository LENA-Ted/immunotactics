class MastCell extends BaseTower {
    constructor(x, y, id) {
        super(x, y, id, IMMUNE_CELL_CONFIGS.MAST_CELL);
        this.apply_adjuvant_hp_bonus();
    }

    apply_adjuvant_hp_bonus() {
        if (window.game_state && window.game_state.resource_system) {
            const hp_multiplier = window.game_state.resource_system.get_adjuvant_hp_multiplier();
            this.hp = Math.ceil(this.config.base_hp * hp_multiplier);
            this.max_hp = this.hp;
        }
    }

    check_activity_criteria() {
        if (!window.game_state || !window.game_state.enemies) {
            return false;
        }

        return window.game_state.enemies.some(enemy => this.is_in_range(enemy));
    }

    perform_action(timestamp) {
        if (!this.has_targets()) {
            return;
        }

        if (!this.can_afford_action()) {
            return;
        }

        this.consume_action_cost();
        this.shoot_cone();
    }

    has_targets() {
        return this.check_activity_criteria();
    }

    shoot_cone() {
        const target = this.find_target();
        if (target) {
            if (window.game_state && window.game_state.audio_system) {
                window.game_state.audio_system.play_sound('SHOOT_PROJECTILE');
            }
            this.create_cone_projectiles(target);
            this.attempt_bidirectional_cone_shot(target);
        }
    }

    attempt_bidirectional_cone_shot(original_target) {
        if (!this.is_directional()) {
            return;
        }

        if (!window.game_state || !window.game_state.adaptation_system) {
            return;
        }

        const opposite_shot_chance = window.game_state.adaptation_system.get_opposite_shot_chance();
        if (opposite_shot_chance <= 0 || Math.random() >= opposite_shot_chance) {
            return;
        }

        this.create_opposite_direction_cone(original_target);
    }

    create_opposite_direction_cone(original_target) {
        const original_angle = MathUtils.get_angle_between(this.x, this.y, original_target.x, original_target.y);
        const opposite_angle = original_angle + Math.PI;
        
        const opposite_target = {
            x: this.x + Math.cos(opposite_angle) * 100,
            y: this.y + Math.sin(opposite_angle) * 100
        };

        this.create_cone_projectiles(opposite_target);
    }

    find_target() {
        if (!window.game_state || !window.game_state.enemies) {
            return null;
        }

        const enemies_in_range = window.game_state.enemies.filter(enemy => this.is_in_range(enemy));
        return this.find_closest_enemy(enemies_in_range);
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

    create_cone_projectiles(target) {
        if (!window.game_state || !window.game_state.projectiles) {
            return;
        }

        const center_angle = MathUtils.get_angle_between(this.x, this.y, target.x, target.y);
        const cone_half_angle = (this.config.cone_angle_degrees / 2) * (Math.PI / 180);
        const projectile_count = this.config.projectile_count;

        for (let i = 0; i < projectile_count; i++) {
            let projectile_angle;
            
            if (projectile_count === 1) {
                projectile_angle = center_angle;
            } else {
                const angle_step = (cone_half_angle * 2) / (projectile_count - 1);
                projectile_angle = center_angle - cone_half_angle + (i * angle_step);
            }

            const projectile = this.create_angled_projectile(projectile_angle);
            if (projectile) {
                window.game_state.projectiles.push(projectile);
            }
        }
    }

    create_angled_projectile(angle) {
        const fake_target = {
            x: this.x + Math.cos(angle) * 100,
            y: this.y + Math.sin(angle) * 100
        };

        const projectile = new Projectile(this.x, this.y, fake_target, this);
        projectile.damage = this.config.projectile_damage;
        
        return projectile;
    }
}

window.MastCell = MastCell;