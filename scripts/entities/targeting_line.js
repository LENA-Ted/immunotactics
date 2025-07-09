class TargetingLine {
    constructor(start_x, start_y, end_x, end_y, duration_ms) {
        this.start_x = start_x;
        this.start_y = start_y;
        this.end_x = end_x;
        this.end_y = end_y;
        this.duration_ms = duration_ms;
        this.start_time = performance.now();
        this.opacity = 0;
        this.flicker_frequency = 2.0;
        this.warning_start_time_ms = duration_ms - 1000;
    }

    update(timestamp) {
        if (!window.game_state || !window.game_state.get_adjusted_elapsed_time) {
            return;
        }

        const elapsed = window.game_state.get_adjusted_elapsed_time(this.start_time);
        const progress = elapsed / this.duration_ms;
        
        if (progress >= 1.0) {
            this.opacity = 0;
            return;
        }

        const is_warning_phase = elapsed >= this.warning_start_time_ms;
        const current_frequency = is_warning_phase ? this.flicker_frequency * 3 : this.flicker_frequency;
        
        const flicker_time = elapsed / 1000.0;
        const base_opacity = is_warning_phase ? 0.8 : 0.6;
        const flicker_amplitude = is_warning_phase ? 0.4 : 0.3;
        
        this.opacity = base_opacity + Math.sin(flicker_time * current_frequency * Math.PI * 2) * flicker_amplitude;
        this.opacity = MathUtils.clamp(this.opacity, 0.1, 1.0);
    }

    draw(ctx) {
        if (this.opacity <= 0) {
            return;
        }

        if (!window.game_state || !window.game_state.get_adjusted_elapsed_time) {
            return;
        }

        const elapsed = window.game_state.get_adjusted_elapsed_time(this.start_time);
        const is_warning_phase = elapsed >= this.warning_start_time_ms;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = is_warning_phase ? '#FF4444' : '#FFFF44';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        
        ctx.beginPath();
        ctx.moveTo(this.start_x, this.start_y);
        ctx.lineTo(this.end_x, this.end_y);
        ctx.stroke();
        
        ctx.restore();
    }

    is_expired() {
        if (!window.game_state || !window.game_state.get_adjusted_elapsed_time) {
            const elapsed = performance.now() - this.start_time;
            return elapsed >= this.duration_ms;
        }
        
        const elapsed = window.game_state.get_adjusted_elapsed_time(this.start_time);
        return elapsed >= this.duration_ms;
    }

    is_alive() {
        return !this.is_expired();
    }
}

window.TargetingLine = TargetingLine;