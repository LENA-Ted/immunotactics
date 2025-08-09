class InoculatedEffect extends BaseStatusEffect {
    constructor() {
        super(Number.MAX_SAFE_INTEGER, STATUS_EFFECT_SOURCES.PATHOGEN);
        this.size_multiplier = 1.5;
        this.speed_multiplier = 1.5;
        this.particle_spawn_timer = 0;
        this.particle_spawn_interval = 200;
    }

    get_type() {
        return 'INOCULATED';
    }

    apply_effect(target) {
        if (target.apply_inoculated_bonuses) {
            target.apply_inoculated_bonuses(this.size_multiplier, this.speed_multiplier);
        }
    }

    remove_effect(target) {
        if (target.remove_inoculated_bonuses) {
            target.remove_inoculated_bonuses();
        }
    }

    update(timestamp) {
        super.update(timestamp);
        this.update_particle_spawning(timestamp);
    }

    update_particle_spawning(timestamp) {
        this.particle_spawn_timer -= 16;
        
        if (this.particle_spawn_timer <= 0) {
            this.particle_spawn_timer = this.particle_spawn_interval;
            this.spawn_inoculated_particle();
        }
    }

    spawn_inoculated_particle() {
        if (!window.game_state || !window.game_state.effects) {
            return;
        }

        const target = this.get_target();
        if (!target) {
            return;
        }

        const particle = this.create_inoculated_particle(target);
        if (particle) {
            window.game_state.effects.push(particle);
        }
    }

    get_target() {
        if (!window.game_state || !window.game_state.enemies) {
            return null;
        }

        return window.game_state.enemies.find(enemy => 
            enemy.status_effects && 
            enemy.status_effects.includes(this)
        );
    }

    create_inoculated_particle(target) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * target.radius * 0.8;
        const particle_x = target.x + Math.cos(angle) * distance;
        const particle_y = target.y + Math.sin(angle) * distance;

        return new InoculatedParticle(particle_x, particle_y);
    }

    get_size_multiplier() {
        return this.size_multiplier;
    }

    get_speed_multiplier() {
        return this.speed_multiplier;
    }
}

class InoculatedParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 1.5 + 0.5;
        this.life = 30;
        this.max_life = 30;
        this.opacity = 1.0;
        this.velocity_x = (Math.random() - 0.5) * 0.5;
        this.velocity_y = (Math.random() - 0.5) * 0.5;
        this.color = '#FFA500';
    }

    update() {
        this.x += this.velocity_x;
        this.y += this.velocity_y;
        this.life--;
        this.opacity = this.life / this.max_life;
    }

    draw(ctx) {
        if (this.life <= 0) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    is_alive() {
        return this.life > 0;
    }
}

window.InoculatedEffect = InoculatedEffect;
window.InoculatedParticle = InoculatedParticle;