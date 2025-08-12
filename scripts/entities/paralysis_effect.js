class ParalysisEffect {
    constructor(x, y, max_radius) {
        this.x = x;
        this.y = y;
        this.max_radius = max_radius;
        this.current_radius = 0;
        this.life = 60;
        this.max_life = 60;
        this.opacity = 1.0;
        this.growth_rate = max_radius / this.max_life;
        this.particles = [];
        this.rings = [];
        
        this.create_particles();
        this.create_rings();
    }

    create_particles() {
        const particle_count = 40;
        
        for (let i = 0; i < particle_count; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                angle: Math.random() * Math.PI * 2,
                speed: MathUtils.get_random_float(1, 4),
                radius: MathUtils.get_random_float(2, 5),
                life: this.max_life,
                max_life: this.max_life,
                color: '#9370DB',
                speed_decay: 0.98
            });
        }
    }

    create_rings() {
        const ring_count = 3;
        
        for (let i = 0; i < ring_count; i++) {
            this.rings.push({
                current_radius: 0,
                max_radius: this.max_radius * (0.6 + i * 0.2),
                growth_rate: this.max_radius * (0.6 + i * 0.2) / (this.max_life * (1.2 + i * 0.1)),
                opacity_decay: 0.015 + i * 0.005,
                opacity: 0.8 - i * 0.2,
                color: `rgba(147, 112, 219, ${0.8 - i * 0.2})`
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

        this.rings.forEach(ring => {
            ring.current_radius += ring.growth_rate;
            ring.opacity -= ring.opacity_decay;
            
            if (ring.current_radius > ring.max_radius) {
                ring.current_radius = ring.max_radius;
            }
            
            if (ring.opacity < 0) {
                ring.opacity = 0;
            }
        });
    }

    draw(ctx) {
        if (this.life <= 0) {
            return;
        }

        this.draw_rings(ctx);
        this.draw_particles(ctx);
    }

    draw_rings(ctx) {
        this.rings.forEach(ring => {
            if (ring.opacity <= 0 || ring.current_radius <= 0) {
                return;
            }
            
            ctx.save();
            ctx.globalAlpha = ring.opacity;
            ctx.strokeStyle = ring.color;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, ring.current_radius, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.globalAlpha = ring.opacity * 0.3;
            ctx.lineWidth = 12;
            ctx.stroke();
            
            ctx.restore();
        });
    }

    draw_particles(ctx) {
        this.particles.forEach(particle => {
            if (particle.life <= 0) {
                return;
            }
            
            ctx.save();
            ctx.globalAlpha = particle.life / particle.max_life;
            ctx.fillStyle = particle.color;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });
    }

    is_alive() {
        return this.life > 0;
    }
}

window.ParalysisEffect = ParalysisEffect;