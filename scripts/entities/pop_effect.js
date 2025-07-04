class PopEffect {
    constructor(x, y, color) {
        this.particles = [];
        this.life = 40;
        this.max_life = 40;
        
        this.create_particles(x, y, color);
    }

    create_particles(x, y, color) {
        const particle_count = 15;
        
        for (let i = 0; i < particle_count; i++) {
            this.particles.push({
                x: x,
                y: y,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 3 + 1,
                radius: Math.random() * 3 + 1,
                life: this.max_life,
                max_life: this.max_life,
                color: color,
                speed_decay: 0.96
            });
        }
    }

    update() {
        this.life--;
        
        this.particles.forEach(particle => {
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;
            particle.speed *= particle.speed_decay;
            particle.life--;
        });
    }

    draw(ctx) {
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
}

window.PopEffect = PopEffect;