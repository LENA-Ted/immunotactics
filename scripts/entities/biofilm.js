class Biofilm {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size_modifier = this.generate_size_modifier();
        this.base_radius = BIOFILM_CONFIG.BASE_RADIUS * this.size_modifier;
        this.current_radius = this.base_radius;
        
        this.harvesting_time_ms = this.generate_harvesting_time();
        this.despawn_time_ms = this.harvesting_time_ms * BIOFILM_CONFIG.DESPAWN_TIME_MULTIPLIER;
        
        this.spawn_time = performance.now();
        this.harvesting_progress = 0;
        this.harvesting_start_time = null;
        this.accumulated_harvesting_time = 0;
        
        this.is_being_harvested = false;
        this.is_completed = false;
        this.is_expired = false;
        
        this.despawn_pause_start_time = null;
        this.total_despawn_pause_time = 0;
        
        this.color = BIOFILM_CONFIG.BASE_COLOR;
        this.shake_offset_x = 0;
        this.shake_offset_y = 0;
    }

    generate_size_modifier() {
        return MathUtils.get_random_float(
            BIOFILM_CONFIG.MIN_SIZE_MODIFIER, 
            BIOFILM_CONFIG.MAX_SIZE_MODIFIER
        );
    }

    generate_harvesting_time() {
        const time_ms = MathUtils.get_random_float(
            BIOFILM_CONFIG.MIN_HARVESTING_TIME_MS,
            BIOFILM_CONFIG.MAX_HARVESTING_TIME_MS
        );
        return Math.floor(time_ms);
    }

    get_total_resource_drops() {
        if (!window.game_state) {
            return 0;
        }
        
        const intensity_level = window.game_state.intensity_level || 1;
        const harvesting_time_seconds = this.harvesting_time_ms / 1000;
        return Math.floor(harvesting_time_seconds * intensity_level);
    }

    get_adjusted_spawn_time() {
        if (!window.game_state || !window.game_state.get_adjusted_elapsed_time) {
            return performance.now() - this.spawn_time;
        }
        return window.game_state.get_adjusted_elapsed_time(this.spawn_time);
    }

    get_adjusted_harvesting_time() {
        if (!this.harvesting_start_time) {
            return 0;
        }
        
        if (!window.game_state || !window.game_state.get_adjusted_elapsed_time) {
            return performance.now() - this.harvesting_start_time;
        }
        
        return window.game_state.get_adjusted_elapsed_time(this.harvesting_start_time);
    }

    start_harvesting() {
        if (this.is_completed || this.is_expired) {
            return;
        }
        
        if (!this.is_being_harvested) {
            this.is_being_harvested = true;
            this.harvesting_start_time = performance.now();
            this.start_despawn_pause();
        }
    }

    stop_harvesting() {
        if (this.is_being_harvested) {
            this.is_being_harvested = false;
            this.accumulated_harvesting_time += this.get_adjusted_harvesting_time();
            this.harvesting_start_time = null;
            this.end_despawn_pause();
        }
    }

    start_despawn_pause() {
        if (!this.despawn_pause_start_time) {
            this.despawn_pause_start_time = performance.now();
        }
    }

    end_despawn_pause() {
        if (this.despawn_pause_start_time) {
            this.total_despawn_pause_time += performance.now() - this.despawn_pause_start_time;
            this.despawn_pause_start_time = null;
        }
    }

    get_total_harvesting_time() {
        let total = this.accumulated_harvesting_time;
        
        if (this.is_being_harvested && this.harvesting_start_time) {
            total += this.get_adjusted_harvesting_time();
        }
        
        return total;
    }

    update_harvesting_progress() {
        const total_harvesting_time = this.get_total_harvesting_time();
        this.harvesting_progress = Math.min(total_harvesting_time / this.harvesting_time_ms, 1.0);
        
        if (this.harvesting_progress >= 1.0) {
            this.complete_harvesting();
        }
    }

    complete_harvesting() {
        if (this.is_completed) {
            return;
        }
        
        this.is_completed = true;
        this.is_being_harvested = false;
        this.end_despawn_pause();
    }

    update_visual_state() {
        this.update_size_from_progress();
        this.update_shake_effect();
    }

    update_size_from_progress() {
        const size_factor = 1 - (this.harvesting_progress * BIOFILM_CONFIG.SHRINK_COMPLETION_PERCENTAGE);
        this.current_radius = this.base_radius * size_factor;
    }

    update_shake_effect() {
        if (this.is_being_harvested && !this.is_completed) {
            const shake_intensity = this.harvesting_progress * BIOFILM_CONFIG.SHAKE_INTENSITY_MAX;
            this.shake_offset_x = (Math.random() - 0.5) * shake_intensity;
            this.shake_offset_y = (Math.random() - 0.5) * shake_intensity;
        } else {
            this.shake_offset_x = 0;
            this.shake_offset_y = 0;
        }
    }

    check_despawn_expiry() {
        if (this.is_completed || this.is_expired) {
            return;
        }
        
        const elapsed_time = this.get_adjusted_spawn_time();
        let adjusted_despawn_time = this.despawn_time_ms + this.total_despawn_pause_time;
        
        if (this.despawn_pause_start_time) {
            adjusted_despawn_time += performance.now() - this.despawn_pause_start_time;
        }
        
        if (elapsed_time >= adjusted_despawn_time) {
            this.is_expired = true;
        }
    }

    update() {
        if (this.is_completed || this.is_expired) {
            return;
        }
        
        this.update_harvesting_progress();
        this.update_visual_state();
        this.check_despawn_expiry();
    }

    is_cursor_hovering(cursor_x, cursor_y) {
        const distance = MathUtils.get_distance(this.x, this.y, cursor_x, cursor_y);
        return distance <= this.current_radius;
    }

    should_be_removed() {
        return this.is_completed || this.is_expired;
    }

    draw(ctx) {
        if (this.should_be_removed()) {
            return;
        }
        
        ctx.save();
        
        const display_x = this.x + this.shake_offset_x;
        const display_y = this.y + this.shake_offset_y;
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = BIOFILM_CONFIG.STROKE_COLOR;
        ctx.lineWidth = BIOFILM_CONFIG.STROKE_WIDTH;
        
        ctx.beginPath();
        ctx.arc(display_x, display_y, this.current_radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }

    generate_resource_particles() {
        if (!window.game_state || !window.game_state.resource_particles) {
            return;
        }
        
        const total_drops = this.get_total_resource_drops();
        const resource_types = [
            RESOURCE_TYPES.CYTOKINES,
            RESOURCE_TYPES.ADJUVANTS,
            RESOURCE_TYPES.BIOMASS
        ];
        
        for (let i = 0; i < total_drops; i++) {
            const random_resource_type = resource_types[Math.floor(Math.random() * resource_types.length)];
            const spawn_position = this.get_random_spawn_position_within_area();
            
            const particle = new ResourceParticle(
                spawn_position.x,
                spawn_position.y,
                random_resource_type
            );
            
            window.game_state.resource_particles.push(particle);
        }
    }

    get_random_spawn_position_within_area() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * this.base_radius;
        
        return {
            x: this.x + Math.cos(angle) * distance,
            y: this.y + Math.sin(angle) * distance
        };
    }
}

window.Biofilm = Biofilm;