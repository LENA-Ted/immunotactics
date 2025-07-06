class ResourceParticle {
    constructor(x, y, resource_type) {
        this.x = x;
        this.y = y;
        this.resource_type = resource_type;
        this.size = RESOURCE_CONFIG.PARTICLE_SIZE;
        this.color = this.get_color_for_type();
        this.spawn_time = performance.now();
        this.is_gravitating = false;
        this.despawn_paused = false;
        this.velocity_x = 0;
        this.velocity_y = 0;
    }

    get_color_for_type() {
        switch (this.resource_type) {
            case RESOURCE_TYPES.CYTOKINES:
                return RESOURCE_CONFIG.CYTOKINE_COLOR;
            case RESOURCE_TYPES.ADJUVANTS:
                return RESOURCE_CONFIG.ADJUVANT_COLOR;
            case RESOURCE_TYPES.BIOMASS:
                return RESOURCE_CONFIG.BIOMASS_COLOR;
            default:
                return '#FFFFFF';
        }
    }

    update(cursor_x, cursor_y) {
        if (!this.is_gravitating) {
            this.check_gravitation_trigger(cursor_x, cursor_y);
        }

        if (this.is_gravitating) {
            this.move_toward_cursor(cursor_x, cursor_y);
        }
    }

    check_gravitation_trigger(cursor_x, cursor_y) {
        const distance = MathUtils.get_distance(this.x, this.y, cursor_x, cursor_y);
        
        if (distance <= RESOURCE_CONFIG.GRAVITATION_DISTANCE) {
            this.start_gravitation();
        }
    }

    start_gravitation() {
        this.is_gravitating = true;
        this.despawn_paused = true;
    }

    move_toward_cursor(cursor_x, cursor_y) {
        const angle = MathUtils.get_angle_between(this.x, this.y, cursor_x, cursor_y);
        this.velocity_x = Math.cos(angle) * RESOURCE_CONFIG.GRAVITATION_SPEED;
        this.velocity_y = Math.sin(angle) * RESOURCE_CONFIG.GRAVITATION_SPEED;
        
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    }

    is_collected_by_cursor(cursor_x, cursor_y) {
        const distance = MathUtils.get_distance(this.x, this.y, cursor_x, cursor_y);
        return distance <= this.size;
    }

    is_expired() {
        if (this.despawn_paused) {
            return false;
        }
        
        const elapsed = performance.now() - this.spawn_time;
        return elapsed >= RESOURCE_CONFIG.PARTICLE_LIFESPAN_MS;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        switch (this.resource_type) {
            case RESOURCE_TYPES.CYTOKINES:
                this.draw_triangle(ctx);
                break;
            case RESOURCE_TYPES.ADJUVANTS:
                this.draw_square(ctx);
                break;
            case RESOURCE_TYPES.BIOMASS:
                this.draw_diamond(ctx);
                break;
        }

        ctx.restore();
    }

    draw_triangle(ctx) {
        const height = this.size * 1.2;
        const half_width = this.size * 0.6;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y - height / 2);
        ctx.lineTo(this.x - half_width, this.y + height / 2);
        ctx.lineTo(this.x + half_width, this.y + height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    draw_square(ctx) {
        const half_size = this.size / 2;

        ctx.beginPath();
        ctx.rect(this.x - half_size, this.y - half_size, this.size, this.size);
        ctx.fill();
        ctx.stroke();
    }

    draw_diamond(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    get_resource_type() {
        return this.resource_type;
    }
}

window.ResourceParticle = ResourceParticle;