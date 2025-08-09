class LightningEffect {
    constructor(start_x, start_y, end_x, end_y) {
        this.start_x = start_x;
        this.start_y = start_y;
        this.end_x = end_x;
        this.end_y = end_y;
        this.life = 30;
        this.max_life = 30;
        this.opacity = 1.0;
        this.segments = [];
        this.generate_zigzag_pattern();
    }

    generate_zigzag_pattern() {
        const distance = MathUtils.get_distance(this.start_x, this.start_y, this.end_x, this.end_y);
        const segment_count = Math.max(3, Math.floor(distance / 30));
        const base_angle = MathUtils.get_angle_between(this.start_x, this.start_y, this.end_x, this.end_y);
        
        this.segments = [];
        
        for (let i = 0; i <= segment_count; i++) {
            const progress = i / segment_count;
            const base_x = this.start_x + (this.end_x - this.start_x) * progress;
            const base_y = this.start_y + (this.end_y - this.start_y) * progress;
            
            let offset_x = 0;
            let offset_y = 0;
            
            if (i > 0 && i < segment_count) {
                const zigzag_amplitude = 15;
                const perpendicular_angle = base_angle + Math.PI / 2;
                const offset_amount = (Math.random() - 0.5) * zigzag_amplitude;
                offset_x = Math.cos(perpendicular_angle) * offset_amount;
                offset_y = Math.sin(perpendicular_angle) * offset_amount;
            }
            
            this.segments.push({
                x: base_x + offset_x,
                y: base_y + offset_y
            });
        }
    }

    update() {
        this.life--;
        this.opacity = Math.max(0, this.life / this.max_life);
        
        if (this.life <= 0) {
            this.opacity = 0;
        }
    }

    draw(ctx) {
        if (this.life <= 0 || this.segments.length < 2) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }
        
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }
        
        ctx.stroke();
        ctx.restore();
    }

    is_alive() {
        return this.life > 0;
    }
}

window.LightningEffect = LightningEffect;