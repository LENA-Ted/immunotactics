class WaveEffect {
    constructor(x, y, max_radius) {
        this.x = x;
        this.y = y;
        this.max_radius = max_radius;
        this.current_radius = 0;
        this.life = 30;
        this.max_life = 30;
        this.opacity = 1.0;
        this.growth_rate = max_radius / this.max_life;
    }

    update() {
        this.life--;
        this.current_radius += this.growth_rate;
        
        const life_progress = this.life / this.max_life;
        this.opacity = life_progress * 0.8;
        
        if (this.current_radius > this.max_radius) {
            this.current_radius = this.max_radius;
        }
    }

    draw(ctx) {
        if (this.life <= 0) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = '#50C878';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.current_radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    is_alive() {
        return this.life > 0;
    }
}

window.WaveEffect = WaveEffect;