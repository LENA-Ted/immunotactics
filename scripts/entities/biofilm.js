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
        this.total_harvesting_time_ms = 0;
        this.harvesting_progress = 0;
        this.displayed_progress = 0;
        this.last_harvest_update_time = 0;
        
        this.despawn_progress = 0;
        this.displayed_despawn_progress = 0;
        
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

    start_harvesting() {
        if (this.is_completed || this.is_expired) {
            return;
        }
        
        if (!this.is_being_harvested) {
            this.is_being_harvested = true;
            this.last_harvest_update_time = performance.now();
            this.start_despawn_pause();
        }
    }

    stop_harvesting() {
        if (this.is_being_harvested) {
            this.update_harvesting_time();
            this.is_being_harvested = false;
            this.end_despawn_pause();
        }
    }

    update_harvesting_time() {
        if (!this.is_being_harvested) {
            return;
        }

        const current_time = performance.now();
        const elapsed_this_session = current_time - this.last_harvest_update_time;
        
        let adjusted_elapsed = elapsed_this_session;
        if (window.game_state && window.game_state.get_adjusted_elapsed_time) {
            adjusted_elapsed = window.game_state.get_adjusted_elapsed_time(this.last_harvest_update_time);
        }

        this.total_harvesting_time_ms += Math.max(0, adjusted_elapsed);
        this.total_harvesting_time_ms = Math.min(this.total_harvesting_time_ms, this.harvesting_time_ms);
        this.last_harvest_update_time = current_time;
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

    update_harvesting_progress() {
        if (this.is_being_harvested) {
            this.update_harvesting_time();
        }

        const new_progress = Math.min(this.total_harvesting_time_ms / this.harvesting_time_ms, 1.0);
        this.harvesting_progress = Math.max(this.harvesting_progress, new_progress);
        
        if (this.harvesting_progress >= 1.0) {
            this.complete_harvesting();
        }
    }

    update_despawn_progress() {
        if (this.is_completed || this.is_expired) {
            return;
        }

        const elapsed_time = this.get_adjusted_spawn_time();
        let adjusted_despawn_time = this.despawn_time_ms + this.total_despawn_pause_time;
        
        if (this.despawn_pause_start_time) {
            adjusted_despawn_time += performance.now() - this.despawn_pause_start_time;
        }

        this.despawn_progress = Math.min(elapsed_time / adjusted_despawn_time, 1.0);
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
        this.update_displayed_progress();
        this.update_size_from_progress();
        this.update_shake_effect();
    }

    update_displayed_progress() {
        this.displayed_progress = MathUtils.dynamic_ease_lerp(
            this.displayed_progress,
            this.harvesting_progress,
            GAME_CONFIG.GAUGE_ANIMATION_BASE_SPEED,
            GAME_CONFIG.GAUGE_ANIMATION_DISTANCE_MULTIPLIER
        );

        this.displayed_despawn_progress = MathUtils.dynamic_ease_lerp(
            this.displayed_despawn_progress,
            this.despawn_progress,
            GAME_CONFIG.GAUGE_ANIMATION_BASE_SPEED,
            GAME_CONFIG.GAUGE_ANIMATION_DISTANCE_MULTIPLIER
        );
    }

    update_size_from_progress() {
        const size_factor = 1 - (this.displayed_progress * BIOFILM_CONFIG.SHRINK_COMPLETION_PERCENTAGE);
        this.current_radius = this.base_radius * Math.max(size_factor, BIOFILM_CONFIG.SHRINK_COMPLETION_PERCENTAGE);
    }

    update_shake_effect() {
        if (this.is_being_harvested && !this.is_completed) {
            const shake_intensity = this.displayed_progress * BIOFILM_CONFIG.SHAKE_INTENSITY_MAX;
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
        
        if (this.despawn_progress >= 1.0) {
            this.is_expired = true;
        }
    }

    update() {
        if (this.is_completed || this.is_expired) {
            return;
        }
        
        this.update_harvesting_progress();
        this.update_despawn_progress();
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

    draw_despawn_gauge(ctx) {
        if (this.should_be_removed() || this.displayed_despawn_progress <= 0.01) {
            return;
        }
        
        const despawn_angle = this.displayed_despawn_progress * Math.PI * 2;
        const gauge_radius = this.current_radius + 8;
        
        ctx.save();
        
        const display_x = this.x + this.shake_offset_x;
        const display_y = this.y + this.shake_offset_y;
        
        ctx.beginPath();
        ctx.arc(display_x, display_y, gauge_radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#00000040';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        if (despawn_angle > 0) {
            ctx.beginPath();
            ctx.arc(display_x, display_y, gauge_radius, -Math.PI / 2, -Math.PI / 2 + despawn_angle);
            ctx.strokeStyle = GAME_CONFIG.COLOR_ENEMY_HP;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
        
        ctx.restore();
    }

    draw_body(ctx) {
        const display_x = this.x + this.shake_offset_x;
        const display_y = this.y + this.shake_offset_y;
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = BIOFILM_CONFIG.STROKE_COLOR;
        ctx.lineWidth = BIOFILM_CONFIG.STROKE_WIDTH;
        
        ctx.beginPath();
        ctx.arc(display_x, display_y, this.current_radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    draw(ctx) {
        if (this.should_be_removed()) {
            return;
        }
        
        this.draw_body(ctx);
        this.draw_despawn_gauge(ctx);
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