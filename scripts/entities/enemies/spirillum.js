class Spirillum extends BaseEnemy {
    constructor(x, y) {
        super(x, y, PATHOGEN_CONFIGS.SPIRILLUM);
        this.pathogen_type = PATHOGEN_TYPES.SPIRILLUM;
        this.pathogen_class = PATHOGEN_CLASSES.BACTERIA;
        this.behavior_state = 'APPROACHING';
        this.targeting_start_time = null;
        this.target_position = null;
        this.targeting_line = null;
        this.has_fixed_speed = false;
        this.fixed_speed_value = this.config.rush_speed;
    }

    update(target, timestamp) {
        this.update_status_effects(timestamp);
        this.update_behavior(target);
        
        if (this.targeting_line) {
            this.targeting_line.update(timestamp);
        }
    }

    update_behavior(target) {
        const distance_to_target = MathUtils.get_distance(this.x, this.y, target.x, target.y);

        switch (this.behavior_state) {
            case 'APPROACHING':
                this.handle_approaching_behavior(target, distance_to_target);
                break;
            case 'TARGETING':
                this.handle_targeting_behavior(target);
                break;
            case 'RUSHING':
                this.handle_rushing_behavior();
                break;
        }
    }

    handle_approaching_behavior(target, distance_to_target) {
        if (distance_to_target <= this.config.targeting_distance) {
            this.start_targeting_behavior(target);
        } else {
            this.move_toward_target(target);
        }
    }

    start_targeting_behavior(target) {
        this.behavior_state = 'TARGETING';
        this.targeting_start_time = performance.now();
        
        this.target_position = {
            x: target.x,
            y: target.y
        };
        
        this.targeting_line = new TargetingLine(
            this.x,
            this.y,
            this.target_position.x,
            this.target_position.y,
            this.config.targeting_duration_ms,
            this
        );
        
        if (window.game_state && window.game_state.effects) {
            window.game_state.effects.push(this.targeting_line);
        }
    }

    handle_targeting_behavior(target) {
        if (!this.targeting_start_time) {
            return;
        }

        let elapsed;
        if (window.game_state && window.game_state.get_adjusted_elapsed_time) {
            elapsed = window.game_state.get_adjusted_elapsed_time(this.targeting_start_time);
        } else {
            elapsed = performance.now() - this.targeting_start_time;
        }

        if (elapsed >= this.config.targeting_duration_ms) {
            this.start_rushing_behavior();
        }
    }

    start_rushing_behavior() {
        this.behavior_state = 'RUSHING';
        this.has_fixed_speed = true;
        
        if (this.targeting_line) {
            this.targeting_line.destroy();
            this.targeting_line = null;
        }
    }

    handle_rushing_behavior() {
        if (!this.target_position) {
            return;
        }

        const distance_to_target = MathUtils.get_distance(this.x, this.y, this.target_position.x, this.target_position.y);
        
        if (distance_to_target <= this.fixed_speed_value) {
            this.x = this.target_position.x;
            this.y = this.target_position.y;
            return;
        }

        const angle = MathUtils.get_angle_between(this.x, this.y, this.target_position.x, this.target_position.y);
        this.x += Math.cos(angle) * this.fixed_speed_value;
        this.y += Math.sin(angle) * this.fixed_speed_value;
    }

    move_toward_target(target) {
        let effective_speed = this.current_speed;
        
        if (this.has_fixed_speed) {
            effective_speed = this.fixed_speed_value;
        }
        
        const angle = MathUtils.get_angle_between(this.x, this.y, target.x, target.y);
        this.x += Math.cos(angle) * effective_speed;
        this.y += Math.sin(angle) * effective_speed;
    }

    calculate_current_speed() {
        if (this.has_fixed_speed) {
            return;
        }
        
        super.calculate_current_speed();
    }

    get_behavior_state() {
        return this.behavior_state;
    }

    is_in_fixed_speed_mode() {
        return this.has_fixed_speed;
    }

    get_pathogen_type() {
        return this.pathogen_type;
    }

    get_pathogen_class() {
        return this.pathogen_class;
    }

    cleanup_targeting_line() {
        if (this.targeting_line) {
            this.targeting_line.destroy();
            this.targeting_line = null;
        }
    }

    take_damage(amount) {
        this.cleanup_targeting_line();
        return super.take_damage(amount);
    }

    get_debug_info() {
        return {
            state: this.behavior_state,
            has_fixed_speed: this.has_fixed_speed,
            fixed_speed_value: this.fixed_speed_value,
            target_position: this.target_position,
            targeting_start_time: this.targeting_start_time
        };
    }
}

window.Spirillum = Spirillum;