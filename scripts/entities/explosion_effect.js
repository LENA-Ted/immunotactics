class ExplosionEffect {
    constructor(x, y, max_radius, source_type = null, source_id = null) {
        this.x = x;
        this.y = y;
        this.max_radius = max_radius;
        this.current_radius = 0;
        this.life = GAME_CONFIG.EXPLOSION_RING_DURATION_FRAMES;
        this.max_life = GAME_CONFIG.EXPLOSION_RING_DURATION_FRAMES;
        this.opacity = 1.0;
        this.growth_rate = max_radius / this.max_life;
        this.particles = [];
        this.source_type = source_type;
        this.source_id = source_id;
        
        this.create_particles();
    }

    create_particles() {
        const particle_count = GAME_CONFIG.EXPLOSION_PARTICLE_COUNT;
        
        for (let i = 0; i < particle_count; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                angle: Math.random() * Math.PI * 2,
                speed: MathUtils.get_random_float(
                    GAME_CONFIG.EXPLOSION_PARTICLE_SPEED_MIN,
                    GAME_CONFIG.EXPLOSION_PARTICLE_SPEED_MAX
                ),
                radius: MathUtils.get_random_float(2, 4),
                life: GAME_CONFIG.EXPLOSION_PARTICLE_LIFE_FRAMES,
                max_life: GAME_CONFIG.EXPLOSION_PARTICLE_LIFE_FRAMES,
                color: GAME_CONFIG.COLOR_EXPLOSION,
                speed_decay: 0.95
            });
        }
    }

    update() {
        this.life--;
        this.current_radius += this.growth_rate;
        
        const life_progress = this.life / this.max_life;
        this.opacity = life_progress * 0.9;
        
        if (this.current_radius > this.max_radius) {
            this.current_radius = this.max_radius;
        }

        this.particles.forEach(particle => {
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;
            particle.speed *= particle.speed_decay;
            particle.life--;
        });
    }

    draw(ctx) {
        if (this.life <= 0) {
            return;
        }

        this.draw_ring(ctx);
        this.draw_particles(ctx);
    }

    draw_ring(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = GAME_CONFIG.COLOR_EXPLOSION;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.current_radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    draw_particles(ctx) {
        this.particles.forEach(particle => {
            if (particle.life <= 0) {
                return;
            }
            
            ctx.save();
            ctx.globalAlpha = particle.life / particle.max_life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    is_alive() {
        return this.life > 0;
    }

    get_source_type() {
        return this.source_type;
    }

    get_source_id() {
        return this.source_id;
    }

    is_immune_cell_explosion() {
        return this.source_type === 'IMMUNE_CELL';
    }
}

window.ExplosionEffect = ExplosionEffect;